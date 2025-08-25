<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserReportResource extends JsonResource
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
                    'url' => "/api/my-reports/{$this->id}/image/{$index}"
                ];
            }),
            'image_count' => $this->images->count(),
            'date' => $this->date,
            'status' => $this->status,
            'creator_id' => $this->creator_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
