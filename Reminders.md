# connecting with live share (MUST BE ON THE SAME NETWORK)

---------------------------------------------------
## LARAVEL HERD (NOT USING ANYMORE)

php -S  10.100.120.127:9001 -t public
(http://10.100.120.127:9001)

----------------------------------------------------

----------------------------------------------------
## XAMPP (CURRENT)

php artisan serve --host=0.0.0.0 --port=9001
npm run dev



### ON LIVE-SHARE MUST:
SHARE THE LOCALHOST 
port:
    9001
    5173

----------------------------------------------------

  ➜  Local:   http://localhost:5173/     
  ➜  Network: http://10.100.120.127:5173/

# If something doesnt work might help

php artisan cache:clear
php artisan view:clear
php artisan config:clear
php artisan event:clear
php artisan route:clear

#  Table migration etc

php artisan make:migration MyCoolTable 
php artisan migrate
php artisan migrate:rollback
php artisan migrate:refresh
php artisan migrate:reset
php artisan migrate:status

# Tailwind 

npm uninstall tailwindcss
npm install tailwindcss@3.2.7