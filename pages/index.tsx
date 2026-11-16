import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type UserData = {
  name: string;
  email: string;
  cvCount: number;
  applied: number;
};

type SessionUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

type Session = {
  user?: SessionUser;
} | null;

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession({ required: false });
  const router = useRouter();

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  useEffect(() => {
    if (session && session.user && session.user.email) {
      setLoading(true);
      fetch("/api/user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, email: session.user.email })
      })
        .then(res => {
          if (!res.ok) throw new Error("API failed");
          return res.json();
        })
        .then(data => {
          setUserData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
          // Fallback data jika API gagal agar tidak 500
          setUserData({
            name: session.user?.name || "User",
            email: session.user?.email || "",
            cvCount: 0,
            applied: 0
          });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  const sessionUser: SessionUser | undefined = session?.user;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            🤖 AutoApply.AI 2.0
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Buat CV profesional, strategi personal branding, dan persiapan wawancara secara otomatis menggunakan AI untuk semua lowongan kerja Anda.
          </p>

          {!sessionUser ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-500 mb-8">
                Login dengan Google untuk memulai
              </p>
              <button
                onClick={() => router.push("/api/auth/signin")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.96 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.33-1.36-.33-2.09s.11-1.43.33-2.09V5.77H2.18C1.43 7.15 1 8.77 1 10.18s.43 3.24.43 5.77z"/>
                </svg>
                Login dengan Google
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat data pengguna...</p>
                </div>
              ) : userData ? (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Selamat datang, {userData.name}!
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {userData.cvCount}
                      </div>
                      <div className="text-sm text-gray-600">
                        CV yang dibuat
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {userData.applied}
                      </div>
                      <div className="text-sm text-gray-600">
                        Lamaran aplikasi
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {userData.cvCount - userData.applied}
                      </div>
                      <div className="text-sm text-gray-600">
                        Menunggu review
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Mulai Membuat CV
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-red-600 mb-4">Gagal memuat data pengguna</p>
                  <button
                    onClick={handleGetStarted}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}