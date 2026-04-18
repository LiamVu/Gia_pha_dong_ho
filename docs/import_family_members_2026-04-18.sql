-- ==========================================
-- IMPORT FAMILY MEMBERS
-- Nguồn: scripts/danh-sach-thanh-vien-2026-04-18.csv (36 thành viên)
-- Ngày import: 2026-04-18
-- Quan hệ: 24 cha-con + 15 mẹ-con + 11 hôn nhân
-- ==========================================
-- Cách dùng: paste toàn bộ file vào Supabase SQL Editor rồi Run.
-- Nếu muốn rollback, thay COMMIT ở cuối bằng ROLLBACK.
-- ==========================================

BEGIN;

-- --------- Temp map: CSV handle → UUID ---------
CREATE TEMP TABLE t_handle_map (
  handle    text PRIMARY KEY,
  person_id uuid NOT NULL DEFAULT gen_random_uuid()
) ON COMMIT DROP;

INSERT INTO t_handle_map (handle) VALUES
  ('vu_minh_tam_f05da2e3'),
  ('vu_thi_hao_581adf94'),
  ('vu_minh_phu_c32a1699'),
  ('vu_minh_quang_d3d1d3f4'),
  ('doan_thi_tuyet_le_c12ba404'),
  ('vu_minh_cuong__0ee75ed8'),
  ('vu_thi_phuong_mnzwnbkh'),
  ('duc_mnzzuq7c'),
  ('doan_thi_huong_mnzyd99m'),
  ('vu_thi_minh_mnzwm1bv'),
  ('quyet_mnzyf2n2'),
  ('vu_minh_tuan_mnzwlq5g'),
  ('vu_minh_thao_mnzwl6ib'),
  ('luu_mnzygvey'),
  ('vu_thi_nga_mnzwmvi6'),
  ('hoang_thi_hong_mnzyefsj'),
  ('trinh_thi_thuong_mnzydpw9'),
  ('vu_thi_yen_mnzwmi8x'),
  ('ba_mo0ccqcy'),
  ('vu_huy_binh_6a20cbb9'),
  ('vo_trinh_mo07lx2i'),
  ('quan_mo0cacu1'),
  ('vu_thanh_luan_6d4711b3'),
  ('xxx_5b53eca5'),
  ('vu_minh_hoang_mnzyjz6i'),
  ('vu_dieu_linh_629d4138'),
  ('na_mo07ka6r'),
  ('vu_minh_thang_mnzz7x32'),
  ('tien_mo0cbg8r'),
  ('vu_minh_lam_mnzyj5y3'),
  ('vu_thi_thu_thuy_mnzz8n0s'),
  ('vu_minh_thong_mnzz94su'),
  ('vu_xx_dung_1ec46f76'),
  ('hanh_mo0cbsxg'),
  ('jayden_mo0a9x27'),
  ('vu_dich_minh_khoi_646e32a6');

-- --------- STEP 1: Insert persons (36 người) ---------
INSERT INTO public.persons (
  id, full_name, gender, generation, is_in_law, is_deceased,
  birth_year, birth_month, birth_day,
  death_year, death_month, death_day,
  other_names, note
)
SELECT
  m.person_id,
  p.full_name, p.gender, p.generation, p.is_in_law, p.is_deceased,
  p.birth_year, p.birth_month, p.birth_day,
  p.death_year, p.death_month, p.death_day,
  p.other_names, p.note
FROM (VALUES
  -- (handle, full_name, gender, gen, is_in_law, is_deceased, b_y, b_m, b_d, d_y, d_m, d_d, other_names, note)
  ('vu_minh_tam_f05da2e3',       'Vũ Minh Tâm',        'male'::public.gender_enum, 1, false, true,  1920,    NULL::int, NULL::int, 1995,      NULL::int, NULL::int, NULL::text, NULL::text),
  ('vu_thi_hao_581adf94',        'Vũ Thị Hảo',         'female', 1, false, false, 1925,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_minh_phu_c32a1699',       'Vũ Minh Phú',        'male',   2, false, false, 1955,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_minh_quang_d3d1d3f4',     'Vũ Minh Quang',      'male',   2, false, true,  1956,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('doan_thi_tuyet_le_c12ba404', 'Đoàn Thị Tuyết Lê',  'female', 2, true,  false, 1960,    NULL, NULL, NULL, NULL, NULL, NULL, 'Nơi sinh: Thanh Hoá'),
  ('vu_minh_cuong__0ee75ed8',    'Vũ Minh Cường',      'male',   2, false, false, 1960,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_thi_phuong_mnzwnbkh',     'Vũ Thị Phương',      'female', 2, false, false, 1963,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('duc_mnzzuq7c',               'Đức',                'male',   2, true,  true,  1964,    NULL, NULL, 1999, NULL, NULL, NULL, 'Ghi chú import: CSV gốc có giá trị 1999 ở cột Ngày sinh — diễn giải thành Năm mất.'),
  ('doan_thi_huong_mnzyd99m',    'Đoàn Thị Hương',     'female', 2, true,  true,  1965,    NULL, NULL, 2025, NULL, NULL, NULL, NULL),
  ('vu_thi_minh_mnzwm1bv',       'Vũ Thị Minh',        'female', 2, false, false, 1965,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('quyet_mnzyf2n2',             'Quyết',              'male',   2, true,  false, 1968,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_minh_tuan_mnzwlq5g',      'Vũ Minh Tuấn',       'male',   2, false, false, 1969,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_minh_thao_mnzwl6ib',      'Vũ Minh Thảo',       'male',   2, false, false, 1970,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('luu_mnzygvey',               'Lưu',                'male',   2, true,  false, 1970,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_thi_nga_mnzwmvi6',        'Vũ Thị Nga',         'female', 2, false, false, 1973,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('hoang_thi_hong_mnzyefsj',    'Hoàng Thị Hồng',     'female', 2, true,  false, 1974,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('trinh_thi_thuong_mnzydpw9',  'Trịnh Thị Thương',   'female', 2, true,  false, 1975,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_thi_yen_mnzwmi8x',        'Vũ Thị Yến',         'female', 2, false, false, 1975,    4,    30,   NULL, NULL, NULL, NULL, NULL),
  ('ba_mo0ccqcy',                'Bá',                 'male',   3, true,  false, 1985,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_huy_binh_6a20cbb9',       'Vũ Huy Bình',        'male',   3, false, false, 1985,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vo_trinh_mo07lx2i',          'Võ Trinh',           'female', 3, false, false, 1991,    7,    4,    NULL, NULL, NULL, NULL, NULL),
  ('quan_mo0cacu1',              'Quân',               'female', 3, true,  false, 1992,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_thanh_luan_6d4711b3',     'Vũ Thành Luân',      'male',   3, false, false, 1993,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('xxx_5b53eca5',               'Tô Linh',            'female', 3, true,  false, 1995,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_minh_hoang_mnzyjz6i',     'Vũ Minh Hoàng',      'male',   3, false, false, 1995,    4,    15,   NULL, NULL, NULL, NULL, NULL),
  ('vu_dieu_linh_629d4138',      'Vũ Diệu Linh',       'female', 3, false, false, 1995,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('na_mo07ka6r',                'Na',                 'male',   3, false, false, 1996,    8,    18,   NULL, NULL, NULL, NULL, NULL),
  ('vu_minh_thang_mnzz7x32',     'Vũ Minh Thắng',      'male',   3, false, false, 1998,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('tien_mo0cbg8r',              'Tiến',               'male',   3, false, false, 1999,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_minh_lam_mnzyj5y3',       'Vũ Minh Lâm',        'male',   3, false, false, 1999,    3,    31,   NULL, NULL, NULL, NULL, NULL),
  ('vu_thi_thu_thuy_mnzz8n0s',   'Vũ Thị Thu Thuỷ',    'female', 3, false, false, 2002,    NULL, NULL, NULL, NULL, NULL, 'Bẹp', NULL),
  ('vu_minh_thong_mnzz94su',     'Vũ Minh Thông',      'male',   3, false, false, 2008,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_xx_dung_1ec46f76',        'Vũ xx Dung',         'female', 3, false, false, NULL,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('hanh_mo0cbsxg',              'Hạnh',               'female', 3, false, false, NULL,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('jayden_mo0a9x27',            'Jayden',             'male',   4, false, false, 2015,    NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('vu_dich_minh_khoi_646e32a6', 'Vũ Địch Minh Khôi',  'male',   4, false, false, NULL,    NULL, NULL, NULL, NULL, NULL, NULL, NULL)
) AS p(handle, full_name, gender, generation, is_in_law, is_deceased,
        birth_year, birth_month, birth_day, death_year, death_month, death_day,
        other_names, note)
JOIN t_handle_map m ON m.handle = p.handle;

-- --------- STEP 2: Quan hệ cha-con (24 cặp) ---------
INSERT INTO public.relationships (type, person_a, person_b)
SELECT 'biological_child'::public.relationship_type_enum, f.person_id, c.person_id
FROM (VALUES
  ('vu_minh_tam_f05da2e3',    'vu_minh_phu_c32a1699'),
  ('vu_minh_tam_f05da2e3',    'vu_minh_quang_d3d1d3f4'),
  ('vu_minh_tam_f05da2e3',    'vu_minh_cuong__0ee75ed8'),
  ('vu_minh_tam_f05da2e3',    'vu_thi_phuong_mnzwnbkh'),
  ('vu_minh_tam_f05da2e3',    'vu_thi_minh_mnzwm1bv'),
  ('vu_minh_tam_f05da2e3',    'vu_minh_tuan_mnzwlq5g'),
  ('vu_minh_tam_f05da2e3',    'vu_minh_thao_mnzwl6ib'),
  ('vu_minh_tam_f05da2e3',    'vu_thi_nga_mnzwmvi6'),
  ('vu_minh_tam_f05da2e3',    'vu_thi_yen_mnzwmi8x'),
  ('vu_minh_cuong__0ee75ed8', 'vu_huy_binh_6a20cbb9'),
  ('quyet_mnzyf2n2',          'vo_trinh_mo07lx2i'),
  ('vu_minh_phu_c32a1699',    'vu_thanh_luan_6d4711b3'),
  ('vu_minh_tuan_mnzwlq5g',   'vu_minh_hoang_mnzyjz6i'),
  ('vu_minh_phu_c32a1699',    'vu_dieu_linh_629d4138'),
  ('luu_mnzygvey',            'na_mo07ka6r'),
  ('vu_minh_thao_mnzwl6ib',   'vu_minh_thang_mnzz7x32'),
  ('quyet_mnzyf2n2',          'tien_mo0cbg8r'),
  ('vu_minh_tuan_mnzwlq5g',   'vu_minh_lam_mnzyj5y3'),
  ('vu_minh_thao_mnzwl6ib',   'vu_thi_thu_thuy_mnzz8n0s'),
  ('vu_minh_thao_mnzwl6ib',   'vu_minh_thong_mnzz94su'),
  ('vu_minh_cuong__0ee75ed8', 'vu_xx_dung_1ec46f76'),
  ('quyet_mnzyf2n2',          'hanh_mo0cbsxg'),
  ('vu_thanh_luan_6d4711b3',  'jayden_mo0a9x27'),
  ('vu_huy_binh_6a20cbb9',    'vu_dich_minh_khoi_646e32a6')
) AS rel(father_h, child_h)
JOIN t_handle_map f ON f.handle = rel.father_h
JOIN t_handle_map c ON c.handle = rel.child_h;

-- --------- STEP 3: Quan hệ mẹ-con (15 cặp) ---------
INSERT INTO public.relationships (type, person_a, person_b)
SELECT 'biological_child'::public.relationship_type_enum, mo.person_id, c.person_id
FROM (VALUES
  ('doan_thi_huong_mnzyd99m',    'vu_huy_binh_6a20cbb9'),
  ('vu_thi_phuong_mnzwnbkh',     'vo_trinh_mo07lx2i'),
  ('doan_thi_tuyet_le_c12ba404', 'vu_thanh_luan_6d4711b3'),
  ('hoang_thi_hong_mnzyefsj',    'vu_minh_hoang_mnzyjz6i'),
  ('doan_thi_tuyet_le_c12ba404', 'vu_dieu_linh_629d4138'),
  ('vu_thi_nga_mnzwmvi6',        'na_mo07ka6r'),
  ('trinh_thi_thuong_mnzydpw9',  'vu_minh_thang_mnzz7x32'),
  ('vu_thi_phuong_mnzwnbkh',     'tien_mo0cbg8r'),
  ('hoang_thi_hong_mnzyefsj',    'vu_minh_lam_mnzyj5y3'),
  ('trinh_thi_thuong_mnzydpw9',  'vu_thi_thu_thuy_mnzz8n0s'),
  ('trinh_thi_thuong_mnzydpw9',  'vu_minh_thong_mnzz94su'),
  ('doan_thi_huong_mnzyd99m',    'vu_xx_dung_1ec46f76'),
  ('vu_thi_phuong_mnzwnbkh',     'hanh_mo0cbsxg'),
  ('xxx_5b53eca5',               'jayden_mo0a9x27'),
  ('quan_mo0cacu1',              'vu_dich_minh_khoi_646e32a6')
) AS rel(mother_h, child_h)
JOIN t_handle_map mo ON mo.handle = rel.mother_h
JOIN t_handle_map c  ON c.handle = rel.child_h;

-- --------- STEP 4: Hôn nhân (11 cặp, mỗi cặp 1 lần) ---------
INSERT INTO public.relationships (type, person_a, person_b)
SELECT 'marriage'::public.relationship_type_enum, a.person_id, b.person_id
FROM (VALUES
  ('vu_minh_tam_f05da2e3',    'vu_thi_hao_581adf94'),
  ('vu_minh_phu_c32a1699',    'doan_thi_tuyet_le_c12ba404'),
  ('vu_minh_cuong__0ee75ed8', 'doan_thi_huong_mnzyd99m'),
  ('vu_thi_phuong_mnzwnbkh',  'quyet_mnzyf2n2'),
  ('duc_mnzzuq7c',            'vu_thi_minh_mnzwm1bv'),
  ('vu_minh_tuan_mnzwlq5g',   'hoang_thi_hong_mnzyefsj'),
  ('vu_minh_thao_mnzwl6ib',   'trinh_thi_thuong_mnzydpw9'),
  ('luu_mnzygvey',            'vu_thi_nga_mnzwmvi6'),
  ('ba_mo0ccqcy',             'hanh_mo0cbsxg'),
  ('vu_huy_binh_6a20cbb9',    'quan_mo0cacu1'),
  ('vu_thanh_luan_6d4711b3',  'xxx_5b53eca5')
) AS m(a_h, b_h)
JOIN t_handle_map a ON a.handle = m.a_h
JOIN t_handle_map b ON b.handle = m.b_h;

-- --------- STEP 5: Private details (chỉ admin xem) ---------
INSERT INTO public.person_details_private (person_id, current_residence)
SELECT m.person_id, 'Xóm 1, Xuân Sơn, Nghệ An'
FROM t_handle_map m
WHERE m.handle = 'doan_thi_tuyet_le_c12ba404';

-- --------- VERIFY ---------
SELECT 'Persons imported' AS metric, COUNT(*)::text AS value FROM public.persons
UNION ALL
SELECT 'Parent-child relationships', COUNT(*)::text FROM public.relationships WHERE type = 'biological_child'
UNION ALL
SELECT 'Marriages',                  COUNT(*)::text FROM public.relationships WHERE type = 'marriage'
UNION ALL
SELECT 'Private detail rows',        COUNT(*)::text FROM public.person_details_private;

COMMIT;

-- Kỳ vọng sau khi chạy:
--   Persons imported: 36
--   Parent-child relationships: 39  (24 cha + 15 mẹ)
--   Marriages: 11
--   Private detail rows: 1
