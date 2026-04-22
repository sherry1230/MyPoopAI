# Claude Code 자동 동기화 셋업 프롬프트

아래 내용을 전부 복사해서 터미널에서 열린 Claude Code에 붙여넣기 하세요.

---

내 Windows 11 환경에 Claude Code 세션 시작/종료 시 자동 동기화 시스템을 셋업해줘. 아래 지시를 순서대로, 정확하게 수행해줘.

## 경로 정보
- 폴더 1 (Cowork 작업용): `C:\Users\thefl\OneDrive\바탕 화면\myPoopAI`
- 폴더 2 (Claude Code 작업용): `C:\Users\thefl\mypoopai-reorg`
- GitHub remote: `https://github.com/sherry1230/MyPoopAI.git`
- 스크립트 저장 위치: `C:\Users\thefl\scripts\`
- Claude Code 설정 파일: `C:\Users\thefl\.claude\settings.json`

## 수행할 작업

### 1. 스크립트 폴더 생성
`C:\Users\thefl\scripts\` 폴더가 없으면 만들어줘.

### 2. `C:\Users\thefl\scripts\start-sync.bat` 생성
내용:
```batch
@echo off
chcp 65001 >nul
echo [START-SYNC] Claude Code 세션 시작 - 동기화 중...

REM 폴더 1의 Cowork 작업분을 GitHub에 올림
cd /d "C:\Users\thefl\OneDrive\바탕 화면\myPoopAI" 2>nul
if %errorlevel%==0 (
    git add -A
    git diff --cached --quiet
    if errorlevel 1 (
        git commit -m "Auto: Cowork changes before Claude Code session"
        git push origin main
    )
)

REM 폴더 2에 최신 반영
cd /d "C:\Users\thefl\mypoopai-reorg" 2>nul
if %errorlevel%==0 (
    git pull origin main
)

echo [START-SYNC] 완료.
exit /b 0
```

### 3. `C:\Users\thefl\scripts\end-sync.bat` 생성
내용:
```batch
@echo off
chcp 65001 >nul
echo [END-SYNC] Claude Code 세션 종료 - 동기화 중...

REM 폴더 2의 Claude Code 작업분을 GitHub에 올림
cd /d "C:\Users\thefl\mypoopai-reorg" 2>nul
if %errorlevel%==0 (
    git add -A
    git diff --cached --quiet
    if errorlevel 1 (
        git commit -m "Auto: Claude Code session %date% %time%"
        git push origin main
    )
)

REM 폴더 1에 최종본 다운로드
cd /d "C:\Users\thefl\OneDrive\바탕 화면\myPoopAI" 2>nul
if %errorlevel%==0 (
    git pull origin main
)

echo [END-SYNC] 완료.
exit /b 0
```

### 4. 폴더 1과 폴더 2가 Git 저장소인지 확인
각 폴더에서 `git rev-parse --is-inside-work-tree`로 확인하고, Git 저장소가 아니면:
- `git init -b main` 실행
- `git remote add origin https://github.com/sherry1230/MyPoopAI.git`
- `git fetch origin` → `git checkout main` 또는 `git pull origin main --allow-unrelated-histories`

이미 Git 저장소면 건너뛰어도 돼.

### 5. 두 폴더의 `.gitignore` 점검
폴더 1과 폴더 2 양쪽 모두 `.gitignore`에 아래 블록이 없으면 끝에 추가해줘 (이미 있으면 건너뛰기):

```
# ===== Cowork 전용 파일 (git에 올리지 않음) =====
# 이미지 작업 파일
*.psd
*.ai
*.sketch
*.fig
*.xd
이미지작업/
images-raw/
assets-raw/

# 암호 / 키 파일
*.env
.env*
*.key
*.pem
*.pfx
password*.txt
secret*.txt
credentials*
*-keys.*

# OS / IDE / 캐시
.DS_Store
Thumbs.db
node_modules/
.vscode/
.idea/
__pycache__/
*.pyc
```

### 6. `C:\Users\thefl\.claude\settings.json` 업데이트
파일이 없으면 새로 만들고, 있으면 **기존 내용을 절대 덮어쓰지 말고** `hooks` 키만 안전하게 병합해줘. 이미 `SessionStart`나 `SessionEnd`가 있으면 해당 배열에 항목만 추가해.

추가할 hooks 항목:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "C:\\Users\\thefl\\scripts\\start-sync.bat",
            "shell": "powershell"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": "logout",
        "hooks": [
          {
            "type": "command",
            "command": "C:\\Users\\thefl\\scripts\\end-sync.bat",
            "shell": "powershell"
          }
        ]
      }
    ]
  }
}
```

병합 후 JSON 유효성 검사도 해줘.

### 7. 테스트 실행
`C:\Users\thefl\scripts\start-sync.bat`을 한 번 직접 실행해서 에러 없이 끝나는지 확인해줘. 에러가 나면 정확한 메시지를 보여주고 원인 진단 + 해결까지 해줘.

### 8. 최종 보고
완료되면 아래 체크리스트 형식으로 결과 보여줘:
- [ ] 스크립트 폴더 생성
- [ ] start-sync.bat 생성
- [ ] end-sync.bat 생성
- [ ] 폴더 1 Git 저장소 확인
- [ ] 폴더 2 Git 저장소 확인
- [ ] .gitignore 업데이트 (폴더 1, 2)
- [ ] settings.json hooks 등록
- [ ] start-sync.bat 테스트 통과

다음 번에 Claude Code를 실행하면 자동으로 시작/종료 시 동기화될 거야.
