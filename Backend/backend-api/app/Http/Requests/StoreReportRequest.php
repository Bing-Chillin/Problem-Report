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
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048', // Only JPG and PNG, max 2MB
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
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a JPG or PNG file.',
            'image.max' => 'The image size cannot exceed 2MB.',
        ];
    }
}
