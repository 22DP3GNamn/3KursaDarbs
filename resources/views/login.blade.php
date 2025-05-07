@extends('layouts.app', ['title' => 'Login Page'])
@section('content')
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <login-page/>
@endsection