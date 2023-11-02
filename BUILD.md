## chạy server
```
cd server
npm install
npm run dev
```
(để tự động reload khi sửa code)
## chạy database ở local dùng docker
### khởi tạo
```
docker run --name mydb -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```
### xem db bằng command line tool của postgres
+ xem id: 
```
docker ps
```
+ lệnh: 
```
docker exec -it <id> psql -U postgres postgres
```

## môi trường
- biến env: file .env.example