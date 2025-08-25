<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subsystem' => $this->subsystem,
            'text' => $this->text,
            'images' => $this->images->map(function($image, $index) {
                return [
                    'id' => $image->id,
                    'filename' => $image->filename,
                    'type' => $image->type,
                    'order_index' => $image->order_index,
                    'url' => "/api/reports/{$this->id}/image/{$index}"
                ];
            }),
            'image_count' => $this->images->count(),
            'date' => $this->date,
            'status' => $this->status,
            "email" => $this->creator->email,
            'name' => $this->creator
                ? $this->creator->last_name . ' ' . $this->creator->first_name
                : "Unknown User",
        ];
    }
}
