# Báo cáo quét site ac-herringhausen.de

Quét ngày 15/11/2026, trên máy local, độc lập với bản quét trên Mac mini.

## Kết quả quét

- 469 URL được tải, 466 thành công (24 MB). 3 link hỏng ngay trên site gốc: `counter.php?art=gesamt`, `counter.php?art=tag`, và ảnh `2018_09_08_05_19_28.png`.
- 25 trang HTML khác nhau, cộng 4 trang phân trang của thư viện ảnh Jugend-Kart.
- 225 ảnh: 97 ảnh trong thư mục `bilder` (ảnh gốc + logo), 82 ảnh thu nhỏ của hai thư viện, còn lại là icon của hPage.
- 3 PDF, đã đọc nội dung.
- 37 file CSS, 10 file JS, 159 file font của nền tảng hPage.
- Ảnh chụp toàn trang của 18 trang, mỗi trang hai cỡ (máy tính 1440px, iPhone 13).
- Log mọi request mạng của 18 trang khi chạy trong Chromium.

## Thư mục

| Đường dẫn | Nội dung |
|---|---|
| `crawl/mirror/` | Bản sao nguyên trạng, kèm file `.headers` cho từng response |
| `crawl/content/` | Chữ của từng trang đã tách khỏi HTML |
| `crawl/pdf/` | 3 PDF và bản chữ |
| `crawl/shots/` | Ảnh chụp từng trang |
| `crawl/sheets/` | Bảng xem nhanh toàn bộ ảnh |
| `crawl/network.json` | Log request mạng và cookie |
| `crawl/manifest.json` | Danh sách mọi URL, trạng thái, loại file, link ra ngoài |
| `crawl/dns/dns.txt` | DNS, mail, chứng chỉ |
| `crawl/images.txt` | Kích thước từng ảnh |
| `tools/` | Script đã dùng |

## Các trang

| Trang | Sửa lần cuối | Có gì |
|---|---|---|
| Start | 01.09.2023 | Lời chào, logo CLB, logo ADAC OWL, địa chỉ Clublokal |
| Aktuelles | 22.06.2025 | Link kết quả 54. Clubsport Slalom; họp thứ Năm đầu tháng, Clubabend thứ Năm thứ ba, 19h |
| Über Uns | 01.09.2023 | "50 Jahre AC Herringhausen 1969–2019", thành lập 01.08.1969 |
| Termine | 18.03.2026 | 3 giải 2026: 19.04 Jugend-Kart-Slalom (toom-Baumarkt, dời từ 12.04), 14.06 55. Clubsport-Slalom, 06.09 Clubsport-Slalom "VG Kreis Herford" |
| Ausschreibungen | 12.05.2025 | 2 link sang adac-sport.com, của năm 2025 |
| Vorstand | 19.02.2024 | 13 chức danh, 13 người |
| Jugend-Kart-Slalom | 23.02.2023 | Giải thích môn, hạng P1–P5, tập thứ Bảy 15h tại Firma Goksch, 2 người liên hệ |
| Clubsport-Slalom | 10.01.2020 | Trống |
| Oldtimer-Rallye | 03.05.2017 | 1 đội, Ford Mustang Fastback 1967, 3 ảnh |
| Jugend-Kart-Foto-Galerie | 04.06.2016 | 71 ảnh, 4 trang |
| Youngster-Foto-Galerie | 04.06.2016 | 11 ảnh |
| Downloads | 23.02.2023 | Haftungsausschluss, Beitrittserklärung, Satzung |
| Partner / Links | 04.01.2017 | ADAC OWL và 6 nhà tài trợ: Herforder Pils, DKS, Fahrschule Kronsbein, Optik Gössel, Weinrich Schokolade, Wachtmann |
| Impressum | 04.04.2024 | Vereinssitz Mittelweg 63 Herford; Verwaltungssitz Arode 11 Hiddenhausen; VR 21235 Bad Oeynhausen; đoạn Datenschutz ngắn |

### Trang không có trong menu (bản quét trước không thấy)

| Trang | Có gì |
|---|---|
| `kontakt.html` | **Form liên hệ đang chạy** (Name, E-Mail, Betreff, Nachricht), có Google reCAPTCHA |
| `guestbook.html` | Sổ lưu bút, có 1 bài từ năm 2012, cũng dùng reCAPTCHA |
| `sitemap.html` | Sơ đồ site kèm ngày sửa từng trang |
| `satzung-ach.html`, `linkliste.html` | Gần như trống |
| `login`, `register`, `forgot_pw`, `change_data`, `logout` | Khung đăng nhập thành viên của hPage, không có nội dung |

## Ảnh

- 64 ảnh cỡ 1280×853 và 18 ảnh 1280×720 là ảnh thư viện. Không có ảnh nào lớn hơn 1280px.
- Ảnh Oldtimer: 3 tấm, nhỏ hơn (668×960 và 800×532).
- Logo CLB chỉ có bản JPG 314×364, không có bản vector.
- Logo nhà tài trợ đều là JPG/GIF nhỏ.

## PDF

| File | Nội dung |
|---|---|
| `Beitrittserklaerung.pdf` | 1 trang: đơn gia nhập, SEPA-Lastschriftmandat, cam kết Datenschutz. Không ghi mức phí |
| `Haftungsausschluss.pdf` | 1 trang: mục 12 miễn trừ trách nhiệm cho người dự giải |
| `Satzung.pdf` | 5 trang: điều lệ CLB bản 2019 |

## Hạ tầng

- **Nền tảng:** hPage (trước là nPage). Máy chủ `85.190.0.112`, openresty. Chứng chỉ Let's Encrypt, hết hạn 03.02.2027.
- **Domain:** nameserver `ns1–ns4.hpage-ns`, tức DNS nằm ở hPage. Bản ghi DENIC đổi lần cuối 04.08.2026.
- **Mail:** MX trỏ về `mail.ac-herringhausen.de` (`85.190.0.170`, của hPage). SPF chỉ cho phép máy chủ hPage gửi. Không có DMARC. Chưa biết CLB có dùng hộp thư trên domain này không.
- **Cookie:** `hpage_v` (7 ngày, mọi trang) và `_GRECAPTCHA` của Google (180 ngày, ở trang Kontakt và Gästebuch).

## Bên thứ ba được gọi khi trang chạy

| Host | Ở đâu | Là gì |
|---|---|---|
| `admin.hpage.com/ownerCheck.php` | mọi trang | hPage kiểm tra người xem có phải chủ site |
| `file2.hpage.com` | 13 trang | Nơi chứa ảnh |
| `www.besucherzaehler-homepage.com` | chỉ trang Start | Bộ đếm lượt truy cập, gọi qua http |
| `www.google.com`, `www.gstatic.com`, `fonts.gstatic.com` | Kontakt, Gästebuch | Google reCAPTCHA |

Banner cookie "Verstanden!" chỉ thông báo, không chặn request nào.

## Khác với bản quét trên Mac mini

- Site **có** form liên hệ và sổ lưu bút, cả hai gọi Google reCAPTCHA. Bản trước ghi là không có form.
- Bộ đếm chỉ được gọi ở trang Start, không phải mọi trang.
- Trang Impressum còn hai dòng "Besucherzähler / Besucher heute" nhưng script đếm của chúng trả về 404.

## Chưa làm được

- Chưa vào được tài khoản hPage nên chưa biết gói đang dùng và có hộp thư nào.
- Chưa thử gửi form liên hệ, nên chưa biết thư về địa chỉ nào.
- Các trang đích trên adac-sport.com (kết quả, Ausschreibung) chưa tải về.
