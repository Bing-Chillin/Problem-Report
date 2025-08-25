<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subsystem' => 'required|string|max:255',
            'text' => 'required|string|max:1000',
            'status' => 'required|string|in:nyitott,lezárt,folyamatban',
            'images' => 'nullable|array|max:5', // Allow up to 5 images
            'images.*' => 'nullable|image|mimes:jpeg,jpg,png|max:2048', // Each image: JPG/PNG, max 2MB, nullable to allow empty slots
        ];
    }

     /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'subsystem.required' => 'The subsystem field is required.',
            'text.required' => 'The report description is required.',
            'status.in' => 'Status must be one of: nyitott, lezárt, folyamatban.',
            'images.array' => 'Images must be provided as an array.',
            'images.max' => 'You can upload a maximum of 5 images.',
            'images.*.image' => 'Each uploaded file must be an image.',
            'images.*.mimes' => 'Each image must be a JPG or PNG file.',
            'images.*.max' => 'Each image size cannot exceed 2MB.',
        ];
    }
}
