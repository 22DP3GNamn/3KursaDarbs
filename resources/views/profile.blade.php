@extends('layouts.app', ['title' => 'Profile Page'])

@section('content') 
<div id="app">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <profile-page
        :user="{{ json_encode($user) }}" 
        profile-image="{{ $profileImage }}"
        update-url="{{ route('profile.update') }}">
    </profile-page>
</div>
@endsection