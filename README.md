# ExpreMotion 당신의 감정을 표현해봐요!!

### Express + Emotion = ExpreMotion

## 1. 결과물 미리보기

---

<img width="1161" alt="스크린샷 2021-09-20 13 46 11" src="https://user-images.githubusercontent.com/57530375/133958888-1f3ce465-c2e3-4184-a169-e76a8f1b5a8e.png">

결과물 링크 : https://expremotion.netlify.app/

<figure class="video_container">
  <video controls="true" allowfullscreen="true" poster="">
    <source src="https://user-images.githubusercontent.com/57530375/133958553-8f3ff493-0334-45da-a83c-01ffea5b930c.mov" type="video/mp4">
  </video>
</figure>

## 2. 자기소개

---

저는 학생입니다. 현재 중학교 3학년으로 중학교에서의 마지막 해를 더욱 의미있게 보내기 위해서 많은 것을 해보고 있습니다. 친구들과 동아리를 만들어서 자율주행자동차, 자율주행드론, 로켓같은 하드웨어와 채팅 앱 같은 소프트웨어도 개발할 예정입니다. 저는 멋진 미래를 그려나갈 것입니다. 세상이 필요로 하는 서비스를 개발하는 착한 개발자가 되고 싶습니다.

## 3. 서비스소개

---

일반적인 SNS 는 좋아요와 싫어요 또는 별점으로 창작물을 평가합니다. 하지만 우리의 감정은 엄청나게 다양합니다. 우리의 감정을 별과 좋아요 싫어요만으로 나타내기에는 부족하다는 생각을 하게되었습니다. 그 결과 오감자톡이나 필챗을 기획하여서 계속 개발중이며 이 프로젝트는 중간 단계로 유저의 감정을 간단하게 표현할 수 있는 서비스를 만들게 되었습니다. 기존의 SNS 가 걸어가지 않았던 특별한 길을 걸어가보기 위해서 이 서비스를 만들게 되었습니다. 이 서비스는 트위터가 가진 모든것을 배끼기 보다는 좋은 것을 받아들이고 적절하게 저의 아이디어를 추가해서 독특한 SNS 를 만들기 위해서 노력했습니다.

### 3-1. 유저

- 3-1-1 회원가입, 이메일 로그인, 소셜 로그인(구글, 깃허브)

  사용자가 더 쉽게 이 서비스를 사용할 수 있도록 구글과 깃허브의 OAuth 를 추가했으며 유저의 정보를 FireBase RealTime Database 에 저장하여 프로필사진과 유저이름과 팔로우 기능 등을 할 수 있도록 하였습니다.

  <img width="1161" alt="스크린샷 2021-09-20 13 50 56" src="https://user-images.githubusercontent.com/57530375/133958900-22cf2337-fc44-44e5-b76a-40220f854770.png">

- 3-1-2 기본 프로필 사진

  프로필 사진이 없을때에는 랜덤 아바타를 변환해주는 API 를 사용하여 각각의 유저의 개성을 살리기 위해서 노력했습니다.

  <img width="61" alt="스크린샷 2021-09-20 14 50 36" src="https://user-images.githubusercontent.com/57530375/133961395-d23ae78a-a486-4939-ae19-7d4a436d5b29.png">

- 3-1-3 프로필 사진 및 유저이름 변경

  유저가 직접 프로필 사진을 변경할 수 있고 처음에 자동적으로 이메일을 유저이름으로 지정한 부분을 변경가능하도록 하였습니다.

  <img width="1162" alt="스크린샷 2021-09-20 13 47 34" src="https://user-images.githubusercontent.com/57530375/133958899-eccdadee-4a15-4ef5-8c7d-2285528f8c19.png">

- 3-1-4 팔로우 언팔로우 기능

  모든 사람의 피드를 보는것은 자신이 좋아하는 게시물만 볼때 불편함이 있을 것 같다는 생각이 들어서 팔로우와 언팔로우 기능으로 자신이 어떤 유저의 피드를 볼지 선택할 수 있도록 하였습니다.

  <img width="1160" alt="스크린샷 2021-09-20 13 47 19" src="https://user-images.githubusercontent.com/57530375/133958895-f71670fd-9f05-41cb-acde-feb6030546e0.png">

### 3-2. 피드

- 3-2-1 피드 작성, 수정, 삭제

  <img width="1161" alt="스크린샷 2021-09-20 13 46 34" src="https://user-images.githubusercontent.com/57530375/133958893-b5657e60-1a78-4a53-8316-6bd640688217.png">

  이 서비스의 가장 근본적인 목적이라고 할 수도 있는 감정표현을 하기 위해서 특별한 피드 작성 페이지를 만들었고 인스타그램 같은 UI/UX 로 유저는 글의 내용을 수정하거나 삭제할 수 있도록 하였습니다.

  <figure class="video_container">
    <video controls="true" allowfullscreen="true" poster="">
      <source src="https://user-images.githubusercontent.com/57530375/133961546-30eb87a7-e2d0-4dd7-84ab-ab275f9c1721.mov" type="video/mp4">
    </video>
  </figure>

  <figure class="video_container">
      <video controls="true" allowfullscreen="true" >
        <source src="https://user-images.githubusercontent.com/57530375/133961535-0b217e66-2fd7-4fe1-a745-297fbab34e8c.mov" type="video/mp4">
      </video>
  </figure>

- 3-2-2 이모지 추가

  <img width="1159" alt="스크린샷 2021-09-20 13 47 07" src="https://user-images.githubusercontent.com/57530375/133958894-753b806a-b43a-4bea-a95d-dbde8583a20a.png">

  다른 분이 만드신 서비스에 이모지를 간단하게 넣을 수 있는 컨테이너가 있는 것을 보고 있으면 유저분들이 더 수월하게 감정을 표현할 수 있기에 좋을 것 같다는 생각이 들어서 추가해봤습니다.

- 3-2-3 좋아요 기능

  원래 처음에는 좋아요 기능을 만들었지만 이 서비스의 목적과 어긋난다는 생각에 과감하게 삭제했습니다.

- 3-2-4 감정 표현

  각각의 피드는 감정 정보를 가지고 있고 이를 모두 개성 넘치게 표현하기 위해서 노력했습니다.

  - Happy 행복 수

    <img width="690" alt="스크린샷 2021-09-20 13 56 34" src="https://user-images.githubusercontent.com/57530375/133958901-abc9d73f-18ce-4620-9bed-6a725c5b62a4.png">

  - Sad 슬픔

    <img width="694" alt="스크린샷 2021-09-20 13 57 15" src="https://user-images.githubusercontent.com/57530375/133958906-6e11c8c5-31d0-48fc-9563-96ff18c4d75f.png">

  - Funny 신남

    <img width="690" alt="스크린샷 2021-09-20 13 56 41" src="https://user-images.githubusercontent.com/57530375/133958902-3061a3c4-625e-4e12-afcd-2ded3bee0e83.png">

  - Angry 화남

    <img width="687" alt="스크린샷 2021-09-20 13 56 51" src="https://user-images.githubusercontent.com/57530375/133958903-37ea3da1-c43a-4978-9f1b-b9aa61963e03.png">

  - Shocked 충격적인

    <img width="695" alt="스크린샷 2021-09-20 13 56 59" src="https://user-images.githubusercontent.com/57530375/133958905-ea22b210-056c-4979-90be-3cf571f01885.png">

  - Soso 그럭저럭

- 3-2-5 댓글

  채팅앱같은 UI/UX 를 적용해서 유저들이 편하게 댓글을 쓸 수 있도록 하였습니다.

  <img width="1160" alt="스크린샷 2021-09-20 13 46 20" src="https://user-images.githubusercontent.com/57530375/133958891-c3542bf4-b9f7-4e4c-bf2d-646cce946936.png">

### 3-3. What's Next

- 3-3-1 유저 각각의 프로필 보기

  팔로워수, 자신의 피드 등등

- 3-3-2 기존 6개의 감정 표현을 더욱 풍부하게 추가

  well 잘, 좋음
  hot 더운
  cold 추운
  hungry 배가 고프다
  full 배가 가득 찬
  proud 자랑
  sick 몸 상태가 좋지 않다.
  hurt 아프다
  sleepy 졸리는
  lonely 외로운 (외로움)
  nervous 초조
  noisy 시끄러운
  grateful 감사하는
  comfortable 편안한
  uncomfortable 불편한
  anxious 불안한
  calm 차분한
  respectful 존경심을 보이는
  generous 후한, 너그러운
  curious 호기심이 많은
  monotonous 단조로운
  letdown 허탈, 슬럼프

- 3-3-3 기타 UI/UX 개선

## 4. 개발과정(어려웠던 점과 해결방법)

---

처음에 개발할때 너무 오랜만에 파이어배이스를 만나서 잠시 방황했던게 가장 큰 어려움이였습니다. 최근에는 직접 Node JS 서버를 만들어서 사용하다보니 자신의 입맛에 맞게 서버의 함수를 만들고 프론트엔드에서는 호출만 하면 됐지만 파이어배이스를 사용하다보니 그런 폭넓은 기능을 프론트엔드에서 구현해야된다는 어려움이 있었습니다. 하지만 예전에 만들었던 HardToSay 와 Nwitter 을 첫줄부터 차례차례 읽으면서 작동 방법을 다시 익혔으며 Cloud FireStore 로는 풍부한 기능 구현이 어려울 것 같아서 RealTime Database 에 대부분의 정보를 저장했습니다. RealTime Database 공식 문서를 꼼꼼하게 천천히 읽으면서 사용법을 익혔으며 익숙한 JSON 방식의 데이터베이스여서 Cloud FireStore 보다 수월하게 개발할 수 있었던 것 같습니다.

사실 가장 큰 적은 자기 자신이였습니다. 이번 년도에 코딩을 굉장히 많이 했고 이 때문에 자주 번아웃이 찾아왔습니다 ;; 하지만 그때마다 초심을 되찾기 위해서 노력했습니다. 코딩을 처음 접하고 직접 키보드를 두드리고 기뻐했던 그 날의 기억을 되살리면서 초심을 되찾는게 도움이 된 것 같습니다. 사소한 것이라도 기뻐하고 자신의 아이디어를 실현시키는 초심을 되찾은게 가장 중요하다고 생각합니다. 만약에 여러분도 번아웃이 오셨다면 뭘해도 즐거웠던 초심을 되찾기 위해 노력하기를 추천합니다!!

## 5. 앞으로의 계획

---

현재 친구들과 함께 해커톤 대회에 나가서 예선을 합격하고 본선이 시작되었습니다. 이제 친구들과 또 다른 여정을 하기 위해서 프로젝트를 만드려고 합니다. 오감자 코인을 만들면서 오랫동안 정체되었던 오감자톡을 생각하면서 이 프로젝트를 만들게 되었고 중학생이 끝나기 전까지 마지막 도전을 할 것입니다. 다른 분들도 너무 멋있는 특별한 Nwitter 을 만들어주신 것 같습니다. 이번 기회에 초심을 되찾는 계기가 된 것 같으며 이 기회를 만들어주신 니코와 린님에게 감사합니다 :)

지금까지 읽어주셔서 너무 감사합니다 !!
