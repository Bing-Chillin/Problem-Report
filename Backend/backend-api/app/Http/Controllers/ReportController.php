<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportImage;
use Illuminate\Http\Request;
use App\Http\Resources\ReportResource;
use App\Http\Resources\UserReportResource;
use App\Http\Requests\StoreReportRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Info(
 *     title="Report API",
 *     version="1.0",
 *     description="API for managing problem reports with image attachments. Note: For file uploads, Postman is recommended over Swagger UI due to better multipart/form-data support."
 * )
 */

class ReportController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/reports",
     *     summary="Get a list of all reports (Admin/Developer/Dispatcher only)",
     *     tags={"Reports"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of reports returned successfully",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="subsystem", type="string", example="ProblemReport"),
     *                 @OA\Property(property="text", type="string", example="Something's broken."),
     *                 @OA\Property(property="date", type="string", format="date-time", example="2025-08-01T10:30:00Z"),
     *                 @OA\Property(property="status", type="string", example="open"),
     *                 @OA\Property(property="email", type="string", example="janos@example.com"),
     *                 @OA\Property(property="name", type="string", example="Kovács János"),
     *                 @OA\Property(
     *                     property="images",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="filename", type="string", example="1692697800_abc123.jpg"),
     *                         @OA\Property(property="type", type="string", example="jpg"),
     *                         @OA\Property(property="order_index", type="integer", example=0)
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden - Admin/Developer/Dispatcher role required")
     * )
     */
    public function index()
    {
        $reports = Report::with(['creator', 'images'])->get();

        return ReportResource::collection($reports);
    }

    /**
     * @OA\Get(
     *     path="/api/my-reports",
     *     summary="Get reports created by the authenticated user",
     *     tags={"Reports"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of user's reports returned successfully",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="subsystem", type="string", example="ProblemReport"),
     *                 @OA\Property(property="text", type="string", example="Something's broken."),
     *                 @OA\Property(property="date", type="string", format="date-time", example="2025-08-01T10:30:00Z"),
     *                 @OA\Property(property="status", type="string", example="open"),
     *                 @OA\Property(
     *                     property="images",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="filename", type="string", example="1692697800_abc123.jpg"),
     *                         @OA\Property(property="type", type="string", example="jpg"),
     *                         @OA\Property(property="order_index", type="integer", example=0)
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function myReports(Request $request)
    {
        $reports = Report::with('images')->where('creator_id', $request->user()->id)->get();

        return UserReportResource::collection($reports);   
    }

    /**
     * @OA\Get(
     *     path="/api/reports/{id}/image",
     *     summary="Get report image (Admin/Developer/Dispatcher only)",
     *     tags={"Reports"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of report",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="imageIndex",
     *         in="path",
     *         description="Index of the image (0-based, defaults to 0)",
     *         required=false,
     *         @OA\Schema(type="integer", default=0)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Image file",
     *         @OA\MediaType(
     *             mediaType="image/jpeg"
     *         )
     *     ),
     *     @OA\Response(response=404, description="Image not found"),
     *     @OA\Response(response=404, description="Report not found"),
     *     @OA\Response(response=404, description="Image file not found"),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function showImage(string $id, int $imageIndex = 0)
    {
        $report = $this->findReportOrFail($id);
        return $this->getReportImage($report, $imageIndex);
    }

    /**
     * @OA\Get(
     *     path="/api/my-reports/{id}/image",
     *     summary="Get image from user's own report",
     *     tags={"Reports"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of user's report",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="imageIndex",
     *         in="path",
     *         description="Index of the image (0-based, defaults to 0)",
     *         required=false,
     *         @OA\Schema(type="integer", default=0)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Image file",
     *         @OA\MediaType(
     *             mediaType="image/jpeg"
     *         )
     *     ),
     *     @OA\Response(response=404, description="Image not found"),
     *     @OA\Response(response=404, description="Report not found"),
     *     @OA\Response(response=404, description="Image file not found")
     *     @OA\Response(response=403, description="Forbidden - Report not owned by user"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function showMyImage(Request $request, string $id, int $imageIndex = 0)
    {
        $report = $this->findReportOrFail($id);

        if ($report->creator_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $this->getReportImage($report, $imageIndex);
    }

    private function findReportOrFail(string $id)
    {
        $report = Report::with('images')->find($id);
        
        if (!$report) {
            abort(response()->json(['message' => 'Report not found'], 404));
        }
        
        return $report;
    }

    private function getReportImage(Report $report, int $imageIndex = 0)
    {
        $images = $report->images;
        
        if ($images->isEmpty() || !isset($images[$imageIndex])) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        $reportImage = $images[$imageIndex];
        $filePath = storage_path('app/private/reports/' . $reportImage->filename);
        
        if (!file_exists($filePath)) {
            return response()->json(['message' => 'Image file not found'], 404);
        }

        return response()->file($filePath, [
            'Content-Type' => $reportImage->type,
            'Cache-Control' => 'public, max-age=3600', // Cache for 1 hour
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/reports",
     *     summary="Create new report (All authenticated users)",
     *     description="Creates a new problem report with optional image attachments. For testing file uploads, use Postman instead of Swagger UI. In Postman: use form-data, add 'images[]' as key (select 'File' type), and attach multiple files with the same key name.",
     *     tags={"Reports"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"subsystem", "text", "status"},
     *                 @OA\Property(property="subsystem", type="string", example="ProblemReport", description="The subsystem where the problem occurred"),
     *                 @OA\Property(property="text", type="string", example="Something is broken", description="Description of the problem", maxLength=1000),
     *                 @OA\Property(property="status", type="string", enum={"nyitott", "lezárt", "folyamatban"}, example="nyitott", description="Status of the report"),
     *                 @OA\Property(
     *                     property="images[]",
     *                     type="array",
     *                     description="Array of image files (Use Postman: form-data with key 'images[]', select File type, max 5 files, JPG/PNG, max 2MB each)",
     *                     @OA\Items(type="string", format="binary"),
     *                     maxItems=5
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Report created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="subsystem", type="string", example="ProblemReport"),
     *             @OA\Property(property="text", type="string", example="Something is broken"),
     *             @OA\Property(property="status", type="string", example="nyitott"),
     *             @OA\Property(property="date", type="string", format="date-time", example="2025-08-22T12:00:00Z"),
     *             @OA\Property(property="creator_id", type="integer", example=3),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2025-08-22T12:00:00Z"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2025-08-22T12:00:00Z"),
     *             @OA\Property(
     *                 property="images",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="report_id", type="integer", example=1),
     *                     @OA\Property(property="filename", type="string", example="1692697800_abc123.jpg"),
     *                     @OA\Property(property="type", type="string", example="jpg"),
     *                     @OA\Property(property="order_index", type="integer", example=0),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2025-08-22T12:00:00Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-08-22T12:00:00Z")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(
     *         response=422, 
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors", 
     *                 type="object",
     *                 @OA\Property(
     *                     property="subsystem", 
     *                     type="array", 
     *                     @OA\Items(type="string", example="The subsystem field is required.")
     *                 ),
     *                 @OA\Property(
     *                     property="images", 
     *                     type="array", 
     *                     @OA\Items(type="string", example="Images must be provided as an array.")
     *                 ),
     *                 @OA\Property(
     *                     property="images.0", 
     *                     type="array", 
     *                     @OA\Items(type="string", example="Each image size cannot exceed 2MB.")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error during report creation",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Failed to create report")
     *         )
     *     )
     * )
     */
    public function store(StoreReportRequest $request)
    {
        $validated = $request->validated();
        
        $validated['date'] = now();
        $validated['creator_id'] = $request->user()->id;

        // Remove images from validated data as it's not a database column
        unset($validated['images']);

        DB::beginTransaction();
        
        try {
            $report = Report::create($validated);

            // Handle multiple image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $extension = $image->getClientOriginalExtension();
                    $filename = time() . '_' . uniqid() . '.' . $extension;
                    $mimeType = $image->getClientMimeType();

                    // Store the file
                    Storage::disk('local')->putFileAs('reports', $image, $filename); 

                    // Create the database record
                    ReportImage::create([
                        'report_id' => $report->id,
                        'filename' => $filename,
                        'type' => $mimeType,
                        'order_index' => $index,
                    ]);
                }
            }

            DB::commit();
            
            // Load the images relationship for the response
            $report->load('images');
            
            return response()->json($report, 201);
            
        } catch (\Exception $e) {
            DB::rollback();
            
            // Log the actual error for debugging
            Log::error('Failed to create report: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => $request->user()->id,
                'request_data' => $request->except(['images']), // Don't log file data
                'stack_trace' => $e->getTraceAsString()
            ]);
            
            // Clean up any uploaded files on error
            if (isset($filename)) {
                Storage::disk('local')->delete('reports/' . $filename); 
            }
            
            return response()->json([
                'error' => 'Failed to create report',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
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
     *     summary="Update the specified report (Admin/Developer/Dispatcher only)",
     *     tags={"Reports"},
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
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="subsystem", type="string", example="ProblemReport"),
     *             @OA\Property(property="text", type="string", example="Updated problem description"),
     *             @OA\Property(property="status", type="string", example="folyamatban"),
     *             @OA\Property(property="date", type="string", format="date-time", example="2025-08-22T12:00:00Z"),
     *             @OA\Property(property="creator_id", type="integer", example=3),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2025-08-22T12:00:00Z"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2025-08-22T12:05:00Z")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Report not found"),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden - Admin/Developer/Dispatcher role required"),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid.")
     *         )
     *     )
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
     *         @OA\JsonContent(
     *             type="integer",
     *             example=1,
     *             description="Number of reports deleted (0 if report was not found, 1 if deleted)"
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden - Admin role required")
     * )
     */
    public function destroy(string $id)
    {
        return Report::destroy($id);
    }
}