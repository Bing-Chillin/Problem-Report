<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use App\Http\Resources\ReportResource;
use App\Http\Requests\StoreReportRequest;
use Illuminate\Support\Facades\Storage;

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
     * @OA\Get(
     *     path="/api/reports/{id}/image",
     *     summary="Get report image (Admin/Developer only)",
     *     tags={"Reports"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of report",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Image file",
     *         @OA\MediaType(
     *             mediaType="image/jpeg"
     *         )
     *     ),
     *     @OA\Response(response=404, description="Image not found"),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function showImage(string $id)
    {
        $report = Report::findOrFail($id);

        if (!$report->image_path) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        $filePath = storage_path('app/private/reports/' . $report->image_path); //full path
        
        if (!file_exists($filePath)) {
            return response()->json(['message' => 'Image file not found'], 404);
        }

        $mimeType = mime_content_type($filePath);

        return response()->file($filePath, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=3600', // Cache for 1 hour
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/reports",
     *     summary="Create new report  (All authenticated users)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="subsystem", type="string", example="ProblemReport"),
     *                 @OA\Property(property="text", type="string", example="Something is broken"),
     *                 @OA\Property(property="status", type="string", enum={"nyitott", "lezárt"}, example="nyitott"),
     *                 @OA\Property(
     *                     property="image", 
     *                     type="string", 
     *                     format="binary", 
     *                     description="Image file (only JPG and PNG allowed, max 2MB)"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Report created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Report")
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(
     *         response=422, 
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function store(StoreReportRequest $request)
    {
        $validated = $request->validated();
        
        $validated['date'] = now();
        $validated['creator_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $extension = $image->getClientOriginalExtension();
            $filename = time() . '_' . uniqid() . '.' . $extension;

            Storage::disk('local')->putFileAs('reports', $image, $filename);

            $validated['image_path'] = $filename; //eg "1723456789_64f2a1b3c4d5e.jpg"
            $validated['image_type'] = $extension;
        }

        // Remove image from validated data as it's not a database column
        unset($validated['image']);

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
