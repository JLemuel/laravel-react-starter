<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($this->user)],
            'email' => ['nullable', 'string', 'email', 'max:255', Rule::unique('users')->ignore($this->user)],
            'password' => $this->isMethod('POST') ? ['required', Password::defaults()] : ['nullable', Password::defaults()],
            'roles' => ['required', 'array'],
            'roles.*' => ['required', 'string', Rule::exists('roles', 'name')]
        ];
    }
} 