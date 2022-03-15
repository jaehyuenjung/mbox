# Serverless Web Application Photo book

서버리스 웹 애플리케이션을 기반으로한 디지털 포토북 웹 서비스.

## Why **mbox**?

여러 사람의 추억의 담긴 디지털 포토북이란 점에서 따와 추억의 **Memory**와 무언가을 담는 상자인 **Box**의 용어를 합쳐 만든 **mbox(Memory-Box)**.

## Features

-   가상 공간에 존재하는 디지털 포토북을 제공.
-   가상 공간에서 자유롭게 포토북을 서로 공유.
-   웹 서비스 형태로 제공되기 때문에 다양한 단말기에서 접속 가능.
-   일반적인 포토북에서 발생하는 현실적인 한계를 벗어나 편리함을 제공:

    |          | 기존 포토북 | 디지털 포토북 |
    | -------- | :---------: | :-----------: |
    | **수정** |      X      |       O       |
    | **비용** |    많음     |     적음      |
    | **크기** |    있음     |     없음      |
    | **관리** |    필요     |    불필요     |

## SetUp

첫번째로, 관련 라이브러리 설치:

```bash
npm i
```

### **PlanetScale** 회원가입

PlanetScale SignUp Link => [https://auth.planetscale.com/sign-up](https://auth.planetscale.com/sign-up)

### **PlanetScale CLI(`pscale`)** 설치:

#### macOS

`pscale` is available via a Homebrew Tap, and as downloadable binary from the [releases](https://github.com/planetscale/cli/releases/latest) page:

```
brew install planetscale/tap/pscale
```

Optional: `pscale` requires the MySQL Client for certain commands. You can install it by running:

```
brew install mysql-client
```

To upgrade to the latest version:

```
brew upgrade pscale
```

#### Linux

`pscale` is available as downloadable binaries from the [releases](https://github.com/planetscale/cli/releases/latest) page. Download the .deb or .rpm from the [releases](https://github.com/planetscale/cli/releases/latest) page and install with `sudo dpkg -i` and `sudo rpm -i` respectively.

#### Windows

`pscale` is available via [scoop](https://scoop.sh/), and as a downloadable binary from the [releases](https://github.com/planetscale/cli/releases/latest) page:

```
scoop bucket add pscale https://github.com/planetscale/scoop-bucket.git
scoop install pscale mysql
```

### `pscale` 설치 유무 확인:

```
pscale
=>
pscale is a CLI library for communicating with PlanetScale's API.

Usage:
  pscale [command]
...
...
```

### `pscale` 로그인

```
pscale auth login
```

로그인 사이트에서 **Confirm Code** 버튼 클릭

### **PlanetScale** 데이타베이스 생성

```
pscale database create mbox --region ap-northeast
```

## Getting Started

### **PlanetScale** 데이타베이스 연결

```
pscale connect mbox
=>
Tried address <LOCALHOST_URL>, but it's already in use. Picking up a random port ...
Secure connection to database mbox and branch main is established!.

Local address to connect your application: <LOCALHOST_URL> (press ctrl-c to quit)
```

### .env 파일 생성 및 작성

```
NEXTAUTH_URL="http://localhost:3000/api/auth"
DATABASE_URL="mysql://<LOCALHOST_URL>/mbox"
AUTH_SECRET=<RANDOM_AUTH_SECRET>
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=<YOUR_EMAIL_ACCOUNT>
EMAIL_SERVER_PASSWORD=<YOUR_EMAIL_PASSWORD>
EMAIL_FROM=Your name <you@email.com>
KAKAO_CLIENT_ID=<YOUR_KAKAO_CLINET_ID>
KAKAO_CLIENT_SECRET=<RANDOM_AUTH_SECRET>
NAVER_CLIENT_ID=<YOUR_NAVER_CLIENT_ID>
NAVER_CLIENT_SECRET=<YOUR_NAVER_CLIENT_SECRET>
FACEBOOK_CLIENT_ID=<YOUR_FACEBOOK_CLIENT_ID>
FACEBOOK_CLIENT_SECRET=<YOUR_FACEBOOK_CLIENT_SECRET>
```

### 서버 실행

```
npm run dev
```
