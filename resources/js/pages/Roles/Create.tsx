import React from 'react';
import { useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/layouts/authenticated-layout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-2xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Create New Role</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2">Role Name</label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Create Role
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

