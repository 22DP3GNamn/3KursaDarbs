<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}"> <!-- CSRF Token -->
    <meta name="user-id" content="{{ Auth::id() }}">
    <title>{{ $title ?? 'Party Management' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js']) <!-- Ensure assets are loaded -->
</head>

<body>
    <div id="app">
        @yield('content') <!-- Render the Vue app -->
    </div>
    <div id="notification-container"></div>
</body>

</html>