let turn = 0;

const board = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 1, 0, 2, 2, 2],
  [2, 2, 2, 0, 1, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

/** 체크하는 방향들 */
const directions = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
];

// 태그 연결
const turn_h2 = document.getElementsByClassName("turn");
const score_h2 = document.getElementsByClassName("score");
const squares = document.getElementsByClassName("square");

// 초기 화면 그리기
draw();

/** 각 버튼마다 걸어놓을 이벤트 리스너 */
for (const square of squares) {
  square.addEventListener("click", function (event) {
    // 각 턴에 맞게 전체적으로 둘 곳이 있는지 확인
    let can_keep_going = checkAvailableSpots();
    // 둘 곳이 없다면 다음턴으로 넘기기
    if (can_keep_going === undefined) {
      window.alert("둘 수 있는 곳이 없습니다. 턴을 넘깁니다.");
      turn++;
      draw();
      return;
    }
    // 둘 곳이 있다면
    else {
      const row = square.dataset.row;
      const column = square.dataset.column;
      const available_spot = checkAvailableSpot(row, column);
      // 해당 위치가 둘 수 없는 곳이라면
      if (available_spot == undefined) {
        window.alert("둘 수 없는 위치입니다.");
        return;
      }
      // 해당 위치가 둘 수 있는 곳이라면
      else {
        board[row][column] = (turn + 2) % 2;
        for (let i = 0; i < available_spot.length; i++) {
          board[available_spot[i].row][available_spot[i].column] =
            (turn + 2) % 2;
        }
        turn++;
        draw();
        // 배열 업데이트 완료 시 현재 점수를 확인
        let score = checkScore();
        // 만약 판을 가득 채웠다면
        if (score[0] + score[1] == 64) {
          if (score[0] > score[1]) {
            window.alert(`black win ${score[0]} : ${score[1]}`);
          } else if (score[0] < score[1]) {
            window.alert(`white win ${score[0]} : ${score[1]}`);
          } else if (score[0] == score[1]) {
            window.alert(`draw ${score[0]} : ${score[1]}`);
          }
          const confirm_message = confirm("게임을 다시 시작하시겠습니까?");
          if (confirm_message == true) {
            gameReset();
            draw();
            return;
          }
        }
      }
    }
  });
}

/**게임 리셋하기 */
function gameReset() {
  turn = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      board[i][j] = 2;
    }
  }
  board[3][3] = board[4][4] = 1;
  board[3][4] = board[4][3] = 0;
}

/**점수 계산하여 [black, white] 배열로 반환 */
function checkScore() {
  let black = 0;
  let white = 0;
  const result = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] == 0) {
        black++;
      } else if (board[i][j] == 1) {
        white++;
      }
    }
  }
  result.push(black, white);
  return result;
}

/**현재 버튼을 누른 곳이 돌을 놓을 수 있는 곳인지 확인하고 뒤집을 위치를 배열로 반환*/
function checkAvailableSpot(row, column) {
  // 해당 칸이 빈칸이 아니라면
  if (board[row][column] == 0 || board[row][column] == 1) {
    return;
  } else {
    // 주변 8방향을 검색해서 뒤집을 것이 있는지 파악하기
    const flippable_spots = checkFlippableSpot(row, column);
    if (flippable_spots.length > 0) {
      return flippable_spots;
    }
  }
}

/**전체 보드에서 놓을 곳이 한 곳이라도 있는지 확인하기 */
function checkAvailableSpots() {
  // 전체 보드를 돌면서
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      // 내 돌이 있는 자리가 아니고
      if (board[i][j] != 0 && board[i][j] != 1) {
        let flippable_spot = checkFlippableSpot(i, j);
        // 뒤집을 수 있는 장소가 있다면 true를 반환
        if (flippable_spot.length > 0) {
          return true;
        }
      }
    }
  }
}

/** 뒤집을 수 있는 곳인지 파악하기 */
function checkFlippableSpot(row, column) {
  const player_stone = (turn + 2) % 2;
  let can_flippable_spots = [];
  let maybe_flippable_spots = [];
  for (let i = 0; i < 8; i++) {
    checking_row = Number(row) + directions[i][0];
    checking_column = Number(column) + directions[i][1];
    maybe_flippable_spots = [];
    while (
      checking_row >= 0 &&
      checking_row < 8 &&
      checking_column >= 0 &&
      checking_column < 8
    ) {
      const checking_spot = board[checking_row][checking_column];
      if (checking_spot == player_stone || checking_spot == 2) {
        if (checking_spot == player_stone) {
          can_flippable_spots = can_flippable_spots.concat(
            maybe_flippable_spots
          );
        }
        break;
      } else {
        maybe_flippable_spots.push({
          row: `${checking_row}`,
          column: `${checking_column}`,
        });
        checking_row += directions[i][0];
        checking_column += directions[i][1];
      }
    }
  }
  return can_flippable_spots;
}

/**화면 그리기 */
function draw() {
  let turn_name = "black";
  if (turn % 2 == 1) {
    turn_name = "white";
  }
  score = checkScore();
  turn_h2[0].textContent = `turn: ${turn_name}`;
  score_h2[0].textContent = `score: black ${score[0]} white ${score[1]}`;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === 0) {
        let spot = document.querySelector(
          `[data-row="${i}"][data-column="${j}"]`
        );
        spot.innerHTML = `⚫️`;
      } else if (board[i][j] === 1) {
        let spot = document.querySelector(
          `[data-row="${i}"][data-column="${j}"]`
        );
        spot.innerHTML = "⚪️";
      } else if (board[i][j] === 2) {
        let spot = document.querySelector(
          `[data-row="${i}"][data-column="${j}"]`
        );
        spot.innerHTML = "";
      }
    }
  }
}
