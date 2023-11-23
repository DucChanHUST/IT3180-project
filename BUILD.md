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
- biến env: copy nội dung file .env.example sang tạo file .env mới

## migrate db
- [Tutorial](https://viblo.asia/p/tao-model-migration-seeds-voi-sequelize-1VgZvOXplAw) 
- khi thực hiện thay đổi cấu trúc DB (vd: thêm bảng, xóa bảng, thêm/xóa cột trong bảng, đổi kiểu dữ liệu của cột, ...) thì dùng Sequelize migrate
- tải sequelize-cli
```
npm install --save-dev sequelize-cli
```
- tạo file chỉ dẫn cho migration (ví dụ trong folder migrations)
```
npx sequelize-cli migration:generate --name <migration name>
```
- thực hiện migration
```
npx sequelize-cli db:migrate
```
### testing
-tải mocha, chai, chai-http, supertest
npm install --save-dev mocha
npm install --save-dev chai
npm install --save-dev chai-http
npm install --save-dev supertest
----
-Chạy test
 npm test
(đã tự động reload khi sửa code)
----
Đề xuất: Có cần tạo db riêng phục vụ testing hay không?
