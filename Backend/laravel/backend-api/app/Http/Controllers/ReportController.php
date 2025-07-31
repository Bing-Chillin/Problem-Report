<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

/**
 * @OA\Info(
 *     title="Report API",
 *     version="1.0",
 *     description="API for managing reports"
 * )
 */

class ReportController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/reports",
     *     summary="Get a list of all reports",
     *     tags={"Reports"},
     *     @OA\Response(
     *         response=200,
     *         description="List of reports returned successfully",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Report")
     *         )
     *     )
     * )
     */
    public function index()
    {
        return Report::all();
    }

    /**
     * @OA\Post(
     *     path="/api/reports",
     *     summary="Create new report",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="subsystem", type="string"),
     *             @OA\Property(property="text", type="string"),
     *             @OA\Property(property="status", type="string")
     *         )
     *         ),
     *         @OA\Response(response=201, description="Created")
     *   )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subsystem' => 'required|string',
            'text' => 'required|string',
            'status' => 'required|string',
        ]);

        $validated['date'] = now();
        $validated['creator_id'] = 1; //auth()->id(); TODO: implement authentication

        $report = Report::create($validated);
        return response()->json($report, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * @OA\Put(
     *     path="/api/reports/{id}",
     *     summary="Update the specified report",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of report to update",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="subsystem", type="string"),
     *             @OA\Property(property="text", type="string"),
     *             @OA\Property(property="status", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Report updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Report")
     *     ),
     *     @OA\Response(response=404, description="Report not found")
     * )
     */
    public function update(Request $request, string $id)
    {
        $report = Report::findOrFail($id);
        $report->update($request->all());
        return $report;
    }

    /**
     * @OA\Delete(
     *     path="/api/reports/{id}",
     *     summary="Delete the specified report",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of report to delete",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Number of deleted records",
     *         @OA\JsonContent(type="integer")
     *     ),
     *     @OA\Response(response=404, description="Report not found")
     * )
     */
    public function destroy(string $id)
    {
        return Report::destroy($id);
    }
}
