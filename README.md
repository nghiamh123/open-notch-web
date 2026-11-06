# OpenNotch — landing page

Trang giới thiệu OpenNotch (Dynamic Island cho tai thỏ MacBook): HTML, CSS, JS thuần, không cần build.

Live: **https://opennotch.nghiadang.site**

## Chạy thử trên máy

```bash
python3 -m http.server 5173
# mở http://localhost:5173
```

## Cấu trúc

```
index.html   style.css   script.js
assets/      icon, poster, og-image, donate-qr, promo.mp4, OpenNotch-0.1.0.dmg
.github/     workflow CI/CD + script kiểm tra
```

Palette lấy từ icon app: cyan `#38E1FF`, tím `#8B5CFF`, hồng `#FF4FB8`, nền `#050507`.

## CI/CD

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

| Sự kiện | Việc làm |
|---|---|
| Pull request vào `main` | Chỉ **kiểm tra**: cú pháp `script.js`, mọi đường dẫn trong `index.html` phải có file thật. Không đụng tới secret. |
| Push vào `main` (hoặc chạy tay) | Kiểm tra → **rsync** lên VPS → gọi thử site và các file chính, phải trả 200. |

Deploy chỉ ghi vào `/var/www/opennotch.nghiadang.site` trên VPS và dùng `--delete`, nên file nào không có trong repo sẽ bị xoá khỏi server.

### Cài đặt CI/CD một lần

Cần một cặp SSH key **riêng cho CI**, và key trên VPS chỉ được phép rsync vào thư mục web của site này (qua `rrsync`), không có shell.

1. Tạo key (không đặt passphrase):

   ```bash
   ssh-keygen -t ed25519 -N "" -C "github-actions@opennotch-web" -f deploy_key
   ```

2. Thêm **public key** vào VPS, kèm giới hạn `rrsync`. Thêm một dòng vào `~/.ssh/authorized_keys` của user `nghia`:

   ```
   command="/usr/bin/rrsync /var/www/opennotch.nghiadang.site",restrict <nội dung deploy_key.pub>
   ```

3. Thêm **private key** vào secret của repo, rồi xoá file key khỏi máy nếu không cần nữa:

   ```bash
   gh secret set DEPLOY_SSH_KEY -R nghiamh123/open-notch-web < deploy_key
   ```

4. Chạy lại workflow: tab **Actions → CI/CD → Run workflow**.

Khi chưa có secret `DEPLOY_SSH_KEY`, bước deploy tự bỏ qua và hiện cảnh báo, phần kiểm tra vẫn chạy.

Host key của VPS được ghim trong workflow (`DEPLOY_KNOWN_HOST`), nên CI từ chối kết nối nếu máy chủ bị giả mạo. Nếu bạn cài lại VPS, cập nhật dòng này.
