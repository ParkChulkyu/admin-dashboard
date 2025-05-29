export default function RegisterSuccessPage() {
  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold mb-4">🎉 가입이 완료되었습니다!</h1>
      <p className="mb-6">이제 서비스를 이용하실 수 있어요.</p>
      <a href="/login" className="text-green-600 underline">
        로그인하러 가기 →
      </a>
    </div>
  );
}
