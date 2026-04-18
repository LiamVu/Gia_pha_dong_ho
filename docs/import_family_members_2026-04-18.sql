-- ==========================================
-- IMPORT FAMILY MEMBERS (single-statement CTE version)
-- Nguồn: scripts/danh-sach-thanh-vien-2026-04-18.csv (36 thành viên)
-- Ngày import: 2026-04-18
-- Quan hệ: 24 cha-con + 15 mẹ-con + 11 hôn nhân + 1 private detail
-- ==========================================
-- Cách dùng: paste toàn bộ file vào Supabase SQL Editor rồi Run.
-- Toàn bộ là 1 câu SQL (dùng CTE) — tất cả insert chạy atomically.
-- Nếu bất kỳ bước nào lỗi → rollback toàn bộ.
-- ==========================================
-- ⚠️ YÊU CẦU: tables persons/relationships/person_details_private đang TRỐNG
--    (hoặc không chứa trùng full_name với 36 người này).
--    Nếu đã có data test, hãy chạy trước:
--      DELETE FROM public.person_details_private;
--      DELETE FROM public.relationships;
--      DELETE FROM public.persons;
-- ==========================================

WITH
-- ====== Source data: 36 persons ======
p_data(full_name, gender, generation, is_in_law, is_deceased,
       birth_year, birth_month, birth_day,
       death_year, death_month, death_day,
       other_names, note) AS (
  VALUES
    ('Vũ Minh Tâm',        'male'::public.gender_enum, 1, false, true,  1920, NULL::int, NULL::int, 1995, NULL::int, NULL::int, NULL::text, NULL::text),
    ('Vũ Thị Hảo',         'female', 1, false, false, 1925, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Minh Phú',        'male',   2, false, false, 1955, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Minh Quang',      'male',   2, false, true,  1956, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Đoàn Thị Tuyết Lê',  'female', 2, true,  false, 1960, NULL, NULL, NULL, NULL, NULL, NULL, 'Nơi sinh: Thanh Hoá'),
    ('Vũ Minh Cường',      'male',   2, false, false, 1960, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Thị Phương',      'female', 2, false, false, 1963, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Đức',                'male',   2, true,  true,  1964, NULL, NULL, 1999, NULL, NULL, NULL, 'Ghi chú import: CSV gốc có giá trị 1999 ở cột Ngày sinh — diễn giải thành Năm mất.'),
    ('Đoàn Thị Hương',     'female', 2, true,  true,  1965, NULL, NULL, 2025, NULL, NULL, NULL, NULL),
    ('Vũ Thị Minh',        'female', 2, false, false, 1965, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Quyết',              'male',   2, true,  false, 1968, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Minh Tuấn',       'male',   2, false, false, 1969, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Minh Thảo',       'male',   2, false, false, 1970, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Lưu',                'male',   2, true,  false, 1970, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Thị Nga',         'female', 2, false, false, 1973, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Hoàng Thị Hồng',     'female', 2, true,  false, 1974, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Trịnh Thị Thương',   'female', 2, true,  false, 1975, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Thị Yến',         'female', 2, false, false, 1975, 4,    30,   NULL, NULL, NULL, NULL, NULL),
    ('Bá',                 'male',   3, true,  false, 1985, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Huy Bình',        'male',   3, false, false, 1985, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Võ Trinh',           'female', 3, false, false, 1991, 7,    4,    NULL, NULL, NULL, NULL, NULL),
    ('Quân',               'female', 3, true,  false, 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Thành Luân',      'male',   3, false, false, 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Tô Linh',            'female', 3, true,  false, 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Minh Hoàng',      'male',   3, false, false, 1995, 4,    15,   NULL, NULL, NULL, NULL, NULL),
    ('Vũ Diệu Linh',       'female', 3, false, false, 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Na',                 'male',   3, false, false, 1996, 8,    18,   NULL, NULL, NULL, NULL, NULL),
    ('Vũ Minh Thắng',      'male',   3, false, false, 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Tiến',               'male',   3, false, false, 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Minh Lâm',        'male',   3, false, false, 1999, 3,    31,   NULL, NULL, NULL, NULL, NULL),
    ('Vũ Thị Thu Thuỷ',    'female', 3, false, false, 2002, NULL, NULL, NULL, NULL, NULL, 'Bẹp', NULL),
    ('Vũ Minh Thông',      'male',   3, false, false, 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ xx Dung',         'female', 3, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Hạnh',               'female', 3, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Jayden',             'male',   4, false, false, 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('Vũ Địch Minh Khôi',  'male',   4, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
),

-- ====== Insert persons, capture (id, full_name) ======
inserted_persons AS (
  INSERT INTO public.persons (full_name, gender, generation, is_in_law, is_deceased,
                               birth_year, birth_month, birth_day,
                               death_year, death_month, death_day,
                               other_names, note)
  SELECT * FROM p_data
  RETURNING id, full_name
),

-- ====== 24 quan hệ cha-con ======
fc_data(father_name, child_name) AS (
  VALUES
    ('Vũ Minh Tâm',   'Vũ Minh Phú'),
    ('Vũ Minh Tâm',   'Vũ Minh Quang'),
    ('Vũ Minh Tâm',   'Vũ Minh Cường'),
    ('Vũ Minh Tâm',   'Vũ Thị Phương'),
    ('Vũ Minh Tâm',   'Vũ Thị Minh'),
    ('Vũ Minh Tâm',   'Vũ Minh Tuấn'),
    ('Vũ Minh Tâm',   'Vũ Minh Thảo'),
    ('Vũ Minh Tâm',   'Vũ Thị Nga'),
    ('Vũ Minh Tâm',   'Vũ Thị Yến'),
    ('Vũ Minh Cường', 'Vũ Huy Bình'),
    ('Quyết',         'Võ Trinh'),
    ('Vũ Minh Phú',   'Vũ Thành Luân'),
    ('Vũ Minh Tuấn',  'Vũ Minh Hoàng'),
    ('Vũ Minh Phú',   'Vũ Diệu Linh'),
    ('Lưu',           'Na'),
    ('Vũ Minh Thảo',  'Vũ Minh Thắng'),
    ('Quyết',         'Tiến'),
    ('Vũ Minh Tuấn',  'Vũ Minh Lâm'),
    ('Vũ Minh Thảo',  'Vũ Thị Thu Thuỷ'),
    ('Vũ Minh Thảo',  'Vũ Minh Thông'),
    ('Vũ Minh Cường', 'Vũ xx Dung'),
    ('Quyết',         'Hạnh'),
    ('Vũ Thành Luân', 'Jayden'),
    ('Vũ Huy Bình',   'Vũ Địch Minh Khôi')
),
inserted_fc AS (
  INSERT INTO public.relationships (type, person_a, person_b)
  SELECT 'biological_child'::public.relationship_type_enum, f.id, c.id
  FROM fc_data d
  JOIN inserted_persons f ON f.full_name = d.father_name
  JOIN inserted_persons c ON c.full_name = d.child_name
  RETURNING id
),

-- ====== 15 quan hệ mẹ-con ======
mc_data(mother_name, child_name) AS (
  VALUES
    ('Đoàn Thị Hương',    'Vũ Huy Bình'),
    ('Vũ Thị Phương',     'Võ Trinh'),
    ('Đoàn Thị Tuyết Lê', 'Vũ Thành Luân'),
    ('Hoàng Thị Hồng',    'Vũ Minh Hoàng'),
    ('Đoàn Thị Tuyết Lê', 'Vũ Diệu Linh'),
    ('Vũ Thị Nga',        'Na'),
    ('Trịnh Thị Thương',  'Vũ Minh Thắng'),
    ('Vũ Thị Phương',     'Tiến'),
    ('Hoàng Thị Hồng',    'Vũ Minh Lâm'),
    ('Trịnh Thị Thương',  'Vũ Thị Thu Thuỷ'),
    ('Trịnh Thị Thương',  'Vũ Minh Thông'),
    ('Đoàn Thị Hương',    'Vũ xx Dung'),
    ('Vũ Thị Phương',     'Hạnh'),
    ('Tô Linh',           'Jayden'),
    ('Quân',              'Vũ Địch Minh Khôi')
),
inserted_mc AS (
  INSERT INTO public.relationships (type, person_a, person_b)
  SELECT 'biological_child'::public.relationship_type_enum, m.id, c.id
  FROM mc_data d
  JOIN inserted_persons m ON m.full_name = d.mother_name
  JOIN inserted_persons c ON c.full_name = d.child_name
  RETURNING id
),

-- ====== 11 hôn nhân ======
marriage_data(a_name, b_name) AS (
  VALUES
    ('Vũ Minh Tâm',    'Vũ Thị Hảo'),
    ('Vũ Minh Phú',    'Đoàn Thị Tuyết Lê'),
    ('Vũ Minh Cường',  'Đoàn Thị Hương'),
    ('Vũ Thị Phương',  'Quyết'),
    ('Đức',            'Vũ Thị Minh'),
    ('Vũ Minh Tuấn',   'Hoàng Thị Hồng'),
    ('Vũ Minh Thảo',   'Trịnh Thị Thương'),
    ('Lưu',            'Vũ Thị Nga'),
    ('Bá',             'Hạnh'),
    ('Vũ Huy Bình',    'Quân'),
    ('Vũ Thành Luân',  'Tô Linh')
),
inserted_marriages AS (
  INSERT INTO public.relationships (type, person_a, person_b)
  SELECT 'marriage'::public.relationship_type_enum, a.id, b.id
  FROM marriage_data d
  JOIN inserted_persons a ON a.full_name = d.a_name
  JOIN inserted_persons b ON b.full_name = d.b_name
  RETURNING id
),

-- ====== Private detail: chỉ Đoàn Thị Tuyết Lê có địa chỉ ======
inserted_private AS (
  INSERT INTO public.person_details_private (person_id, current_residence)
  SELECT ip.id, 'Xóm 1, Xuân Sơn, Nghệ An'
  FROM inserted_persons ip
  WHERE ip.full_name = 'Đoàn Thị Tuyết Lê'
  RETURNING person_id
)

-- ====== Verify: kỳ vọng 36 / 24 / 15 / 11 / 1 ======
SELECT
  (SELECT COUNT(*) FROM inserted_persons)   AS persons_imported,
  (SELECT COUNT(*) FROM inserted_fc)        AS father_child,
  (SELECT COUNT(*) FROM inserted_mc)        AS mother_child,
  (SELECT COUNT(*) FROM inserted_marriages) AS marriages,
  (SELECT COUNT(*) FROM inserted_private)   AS private_details;
