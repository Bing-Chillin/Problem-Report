<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Add this import

/**
 * @OA\Schema(
 *     schema="Report",
 *     type="object",
 *     title="Report",
 *     description="Report model",
 *     required={"subsystem", "text", "status"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="subsystem", type="string", example="ProblemReport"),
 *     @OA\Property(property="text", type="string", example="Can't submit the report"),
 *     @OA\Property(property="status", type="string", example="open"),
 *     @OA\Property(property="date", type="string", format="date-time", example="2025-07-31T12:00:00Z"),
 *     @OA\Property(property="creator_id", type="integer", example=3),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-07-31T12:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-07-31T12:05:00Z")
 * )
 */

class Report extends Model
{
    protected $fillable = [
        'subsystem',
        'text',
        'date',
        'status',
        'creator_id',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function images()
    {
        return $this->hasMany(ReportImage::class)->orderBy('order_index');
    }
}
