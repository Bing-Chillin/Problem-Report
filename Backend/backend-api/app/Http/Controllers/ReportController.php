<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use App\Http\Resources\ReportResource;

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
     *     summary="Get a list of all reports  (Admin/Developer only)",
     *     tags={"Reports"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of reports returned successfully",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="subsystem", type="string", example="ProblemReort"),
     *                 @OA\Property(property="text", type="string", example="Something's broken."),
     *                 @OA\Property(property="image_path", type="string", example="/images/problem.jpg"),
     *                 @OA\Property(property="image_type", type="string", example="jpg"),
     *                 @OA\Property(property="date", type="string", format="date-time", example="2025-08-01T10:30:00Z"),
     *                 @OA\Property(property="status", type="string", example="open"),
     *                 @OA\Property(property="email", type="string", example="janos@example.com"),
     *                 @OA\Property(property="name", type="string", example="Kovács János")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden - Admin/Developer role required")
     * )
     */
    public function index()
    {
        $reports = Report::with('creator')->get();

        return ReportResource::collection($reports);
    }

    /**
     * @OA\Post(
     *     path="/api/reports",
     *     summary="Create new report  (All authenticated users)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="subsystem", type="string"),
     *             @OA\Property(property="text", type="string"),
     *             @OA\Property(property="status", type="string")
     *         )
     *         ),
     *     @OA\Response(response=201, description="Created"),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=422, description="Validation error")
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
        $validated['creator_id'] = $request->user()->id;

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
     *     summary="Update the specified report (Admin/Developer only)",
     *     security={{"bearerAuth":{}}},
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
     *     @OA\Response(response=404, description="Report not found"),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden - Admin/Developer role required")
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
     *     summary="Delete the specified report (Admin only)",
     *     security={{"bearerAuth":{}}},
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
     *     @OA\Response(response=404, description="Report not found"),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden - Admin role required")
     * )
     */
    public function destroy(string $id)
    {
        return Report::destroy($id);
    }
}
