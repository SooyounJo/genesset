# ComfyUI 원격 연결(다른 와이파이) 추천 방식

## 결론

**가장 안전하고 간단한 방법은 Tailscale(무료 VPN)로 두 컴퓨터를 같은 사설망처럼 연결하는 것**입니다.  
포트포워딩처럼 ComfyUI를 인터넷에 노출하지 않아도 됩니다.

## 1) 상대 PC(ComfyUI가 실행되는 PC)에서 할 일

- Tailscale 설치 후 로그인
- ComfyUI 실행을 외부 접속 가능하게 실행
  - 예시(권장): `python main.py --listen 0.0.0.0 --port 8188`
- Windows 방화벽에서 `8188` 인바운드 허용(Private 네트워크 또는 Tailscale 네트워크)
- Tailscale에서 상대 PC의 IP 확인(보통 `100.x.y.z`)

## 2) 내 PC(이 Next.js 프로젝트 실행 PC)에서 할 일

- Tailscale 설치 후 **같은 계정**으로 로그인(또는 상대가 “공유”로 초대)
- 브라우저에서 `http://100.x.y.z:8188` 접속이 되는지 확인
- 이 프로젝트에 `.env.local` 생성 후 아래처럼 설정

```bash
COMFYUI_BASE_URL=http://100.x.y.z:8188
```

## 대안(설치가 어렵다면)

- Cloudflare Tunnel / ngrok로 `8188`을 임시 URL로 공개 가능\n+  - 단, ComfyUI는 기본적으로 인증이 없어서 “공개 URL”은 보안 위험이 큽니다.\n+
