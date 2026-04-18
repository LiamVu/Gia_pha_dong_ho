"use client";

import config from "@/app/config";
import DongSonDrum, { DongSonHaloMemo } from "@/components/DongSonDrum";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft, KeyRound, Mail, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
const THEME_KEY = "giapha-landing-theme";

function readSavedTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_KEY);
  return saved === "dark" || saved === "light" ? (saved as Theme) : "light";
}

export default function LoginPage() {
  const [theme, setTheme] = useState<Theme>(readSavedTheme);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname === config.demoDomain) {
        setIsDemo(true);
        setEmail("giaphaos@homielab.com");
        setPassword("giaphaos");
      }
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === THEME_KEY &&
        (e.newValue === "light" || e.newValue === "dark")
      ) {
        setTheme(e.newValue as Theme);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        if (password !== confirmPassword) {
          setError("Mật khẩu xác nhận không khớp.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
          if (
            error.message.includes("relation") &&
            error.message.includes("does not exist")
          ) {
            router.push("/setup");
            return;
          }
          setError(error.message);
        } else if (data.user?.identities && data.user.identities.length === 0) {
          setError(
            "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.",
          );
        } else if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({ email, password });
          if (!signInError && signInData.session) {
            router.push("/dashboard");
            router.refresh();
          } else {
            setSuccessMessage(
              "Đăng ký thành công! Vui lòng chờ admin kích hoạt tài khoản để xem nội dung.",
            );
            setIsLogin(true);
            setConfirmPassword("");
            setPassword("");
          }
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="landing-root relative min-h-screen w-full overflow-hidden"
      data-theme={theme}
      style={{
        background: "var(--l-bg)",
        color: "var(--l-ink)",
        fontFamily: "var(--font-lora), var(--font-playfair), serif",
      }}
    >
      {/* ===== Background ===== */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{ color: "var(--l-stroke)" }}
      >
        <div className="absolute inset-0 landing-paper" />
        <div className="drum-halo w-[min(130vmin,1500px)] aspect-square opacity-[0.18]">
          <DongSonHaloMemo />
        </div>
        <div
          className="drum-center w-[min(95vmin,1100px)] aspect-square"
          style={{
            opacity: "var(--l-drum-opacity)",
            filter: "drop-shadow(0 0 40px rgba(94,58,23,0.15))",
          }}
        >
          <DongSonDrum />
        </div>
        <div
          className="absolute inset-0 landing-grain"
          style={{ opacity: "var(--l-grain-opacity)" }}
        />
      </div>

      {/* ===== Page ===== */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-10 pt-6 sm:pt-8 pb-8">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border backdrop-blur-sm text-[10px] sm:text-[11px] tracking-[0.18em] uppercase transition-all hover:-translate-y-px"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              borderColor: "var(--l-line)",
              background:
                theme === "light"
                  ? "rgba(255,250,240,0.65)"
                  : "rgba(60,44,30,0.55)",
              color: "var(--l-bronze-deep)",
            }}
          >
            <ChevronLeft className="size-3" />
            Trang chủ
          </Link>

          <button
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Chuyển sang tối" : "Chuyển sang sáng"
            }
            title={theme === "light" ? "Chuyển sang tối" : "Chuyển sang sáng"}
            className="size-9 sm:size-10 grid place-items-center rounded-full border backdrop-blur-sm transition-all hover:-translate-y-px"
            style={{
              borderColor: "var(--l-line)",
              background:
                theme === "light"
                  ? "rgba(255,250,240,0.6)"
                  : "rgba(60,44,30,0.55)",
              color: "var(--l-bronze-deep)",
            }}
          >
            {theme === "light" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </button>
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center py-8 sm:py-10">
          <div
            className="relative w-full max-w-[460px] backdrop-blur-[14px] border p-8 sm:p-12"
            style={{
              background: "var(--l-card)",
              borderColor: "var(--l-card-border)",
            }}
          >
            {/* Corner brackets */}
            <span
              className="absolute -top-px -left-px size-[18px] border"
              style={{
                borderColor: "var(--l-bronze)",
                borderRight: "none",
                borderBottom: "none",
              }}
            />
            <span
              className="absolute -bottom-px -right-px size-[18px] border"
              style={{
                borderColor: "var(--l-bronze)",
                borderLeft: "none",
                borderTop: "none",
              }}
            />

            {/* Mark */}
            <div
              className="size-12 mx-auto mb-5 grid place-items-center"
              style={{ color: "var(--l-bronze)" }}
            >
              <svg
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <circle cx={20} cy={20} r={16} />
                <circle cx={20} cy={20} r={11} />
                <path
                  d="M20 10 L22 17 L29 18 L23 22 L26 30 L20 25 L14 30 L17 22 L11 18 L18 17 Z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </div>

            <h1
              className="text-center font-semibold text-[36px] sm:text-[44px] leading-none mb-2.5 tracking-tight"
              style={{
                fontFamily: "var(--font-lora), var(--font-playfair), serif",
                color: "var(--l-ink)",
              }}
            >
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </h1>
            <p
              className="text-center italic text-[14px] sm:text-[15px] mb-8"
              style={{ color: "var(--l-ink-soft)" }}
            >
              {isLogin
                ? "Đăng nhập để truy cập gia phả."
                : "Tạo tài khoản thành viên mới."}
            </p>

            {isDemo && (
              <div
                className="mb-5 px-3 py-2.5 rounded border text-[12px] sm:text-[13px] text-center font-semibold"
                style={{
                  borderColor: "var(--l-line)",
                  background: "rgba(194,138,61,0.12)",
                  color: "var(--l-bronze-deep)",
                }}
              >
                Website Demo. Dữ liệu không có thật.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field
                label="Email"
                id="email-address"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={setEmail}
                icon={<Mail className="size-4" />}
                theme={theme}
              />
              <Field
                label="Mật khẩu"
                id="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={setPassword}
                icon={<KeyRound className="size-4" />}
                theme={theme}
              />
              {!isLogin && (
                <Field
                  label="Xác nhận mật khẩu"
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  icon={<KeyRound className="size-4" />}
                  theme={theme}
                />
              )}

              {error && (
                <div
                  className="px-3 py-2.5 rounded text-[13px] text-center border"
                  style={{
                    background: "rgba(220, 38, 38, 0.08)",
                    borderColor: "rgba(220, 38, 38, 0.25)",
                    color: "#b91c1c",
                  }}
                >
                  {error}
                </div>
              )}
              {successMessage && (
                <div
                  className="px-3 py-2.5 rounded text-[13px] text-center border"
                  style={{
                    background: "rgba(5, 150, 105, 0.08)",
                    borderColor: "rgba(5, 150, 105, 0.25)",
                    color: "#047857",
                  }}
                >
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full px-5 py-4 mt-3 font-medium text-[12px] sm:text-[13px] tracking-[0.22em] uppercase transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-wait"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  background: "var(--l-btn-bg)",
                  color: "var(--l-btn-fg)",
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    e.currentTarget.style.background =
                      "var(--l-btn-bg-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!loading)
                    e.currentTarget.style.background = "var(--l-btn-bg)";
                }}
              >
                <span
                  className="absolute inset-1 border pointer-events-none"
                  style={{ borderColor: "var(--l-btn-border)" }}
                />
                <span className="relative">
                  {loading
                    ? "Đang xử lý..."
                    : isLogin
                      ? "Đăng nhập"
                      : "Tạo tài khoản"}
                </span>
              </button>

              <div
                className="flex items-center gap-3.5 my-5 text-[10px] tracking-[0.3em] uppercase"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--l-muted)",
                }}
              >
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--l-line)" }}
                />
                <span>Hoặc</span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--l-line)" }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isLogin && isDemo) {
                    setError(
                      "Đây là trang demo, bạn không cần phải tạo tài khoản. Hãy sử dụng tài khoản demo để truy cập với toàn bộ quyền.",
                    );
                    return;
                  }
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="w-full px-5 py-3.5 border text-[14px] sm:text-[14.5px] transition-all hover:-translate-y-px"
                style={{
                  fontFamily: "var(--font-lora), var(--font-playfair), serif",
                  color: "var(--l-ink)",
                  borderColor: "var(--l-card-border)",
                  background: "transparent",
                }}
              >
                {isLogin ? (
                  <>
                    Chưa có tài khoản?{" "}
                    <b
                      className="font-semibold"
                      style={{ color: "var(--l-bronze-deep)" }}
                    >
                      Đăng ký ngay
                    </b>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{" "}
                    <b
                      className="font-semibold"
                      style={{ color: "var(--l-bronze-deep)" }}
                    >
                      Đăng nhập
                    </b>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  icon,
  theme,
}: {
  label: string;
  id: string;
  type: string;
  autoComplete?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  theme: Theme;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-medium text-[10px] tracking-[0.22em] uppercase mb-2"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "var(--l-bronze-deep)",
        }}
      >
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 px-4 py-3 border transition-all"
        style={{
          borderColor: focused
            ? "var(--l-bronze-deep)"
            : "var(--l-card-border)",
          background:
            theme === "light"
              ? focused
                ? "rgba(255,250,240,0.96)"
                : "rgba(255,250,240,0.7)"
              : focused
                ? "rgba(74,55,37,0.8)"
                : "rgba(60,44,30,0.55)",
          boxShadow: focused ? "0 0 0 3px rgba(194,138,61,0.14)" : "none",
        }}
      >
        <span style={{ color: "var(--l-muted)" }}>{icon}</span>
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent border-none outline-none text-[15px]"
          style={{
            fontFamily: "var(--font-lora), var(--font-playfair), serif",
            color: "var(--l-ink)",
          }}
        />
      </div>
    </div>
  );
}
