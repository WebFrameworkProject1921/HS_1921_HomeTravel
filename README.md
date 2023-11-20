# 방구석 국내여행 사이트
이 프로젝트는 여행 계획을 손쉽게 짜고 공유 할 수 있는 웹애플리케션입니다. 백엔드는 Spring Boot를 사용하고 프론트엔드는 React로 개발되었습니다.

## 기능
### Main
- **검색어를 이용한 지도 및 날씨, 뉴스 정보 조회**
  메인 화면에서 검색어를 입력하면 지도가 표시되고, 입력한 위치의 날씨 및 뉴스 정보가 우측에 표시됩니다. 이 정보는 카카오맵 API, 날씨 API와 뉴스 API를 이용하여 가져옵니다.
- **사진 정보 조회**
  관광 버튼을 클릭하면 검색어와 관련된 이미지를 투어 API를 이용하여 가져와서 표시합니다.
- **유튜브 동영상 검색**
  유튜브 버튼을 클릭하면 검색어와 관련된 유튜브 동영상이 나타납니다. 이 기능은 유튜브 API를 활용하여 구현되었습니다.
- **챗GPT를 이용한 여행 계획 생성**
  GPT 버튼을 누르면 챗GPT를 활용하여 사용자에게 여행 계획을 자동으로 제안해줍니다. 
### Calender
- **여행지를 카드 단위 관리**
  캘린더 화면에서 여행 일정을 react-beautiful-dnd 라이브러리를 이용해 카드 단위로 드래그 앤 드롭이 가능하게 구현했습니다.
- **여행지 추가 및 정보 확인**
  카카오맵 API를 이용해서 여행지를 카드로 추가 할 수 있습니다. 카드를 누르면 모달창이 나오고 여행지 정보를 확인할 수 있습니다.
- **여행 동선 및 시간확인**
  계획한 여행지들이 추가되있는 컬럼을 누르면 해당 일자의 동선 및 이동거리, 예상 이동 시간 등을 보여줍니다. 
### SNS
  SNS 화면에서는 사용자가 여행에 관한 게시물을 작성하고 공유할 수 있습니다.
- **게시물 작성**
  - 게시물에는 사진, 메모, 카카오맵 API를 이용한 위치 정보를 넣어서 작성할 수 있습니다..
- **게시물 수정/삭제**
  자신이 작성한 게시물은 언제든지 수정 및 삭제할 수 있습니다.
- **댓글 기능**
  다른 사용자의 게시물에 댓글을 작성할 수 있습니다.

## 사용 API
- **지도 통합**: 카카오맵 API
- **날씨 정보**: 날씨 API
- **뉴스 정보**: 뉴스 API
- **유튜브 검색**: 유튜브 API
- **GPT 서비스**: OpenAI GPT (ChatGPT)
- **이미지 검색**: 투어 API
- **지도 경로 계산**: 카카오 모빌리티 API

## 백엔드 개발 환경 설정
1. **IntelliJ 설정**
   - IntelliJ를 열고 프로젝트를 로드합니다.
   - File > Project Structure> Project Settings> Project 로 이동합니다.
   - SDK를 OpenJDK 21을 선택합니다.
    
2. **Gradle 설정**
   - File > Settings > Build, Execution, Deployment > Build Tools > Gradle로 이동합니다.
   - Gradle JVM에서 OpenJDK 21을 선택합니다.

3. **application.properties 설정**
   - `src/main/resources/application.properties` 파일을 엽니다.
   - `file.dir` 속성을 SNS 이미지가 저장될 폴더 경로로 설정합니다.

## 실행방법 
1. IntelliJ에서 HomeTravel_Back 폴더를 open 한다.
2. 위에 백앤드 개발 환경 설정이 맞는지 확인한다.
3. src>main>java>com.example.demo>service 폴더의 DemoApplication을 실행 시킨다.
4. visual studio code에서 HomeTravel_Front 폴더를 open한다.
5. npm start를 통해 실행시킨다.

