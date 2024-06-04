/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button } from 'flowbite-react';

function Square({ value, onSquareClick }) {
  // ini sudah ngga perlu karena kita sudah mengatur perubahan value nya di komponen parent nya yaitu Board(), sehingga dapat mengetahui pergerakan X dan O masing"
  // kalau state dan function nya ditaturh di dalam square, brti yg tau value nya cuma square saja, sedangkan board tidak (padahal kita perlu tracking kalau user sudah streak 3 brti harus menang)

  // const [value, setValue] = useState("");

  // function handleClick(){
  //   setValue("X");
  // }
  return <Button onClick={onSquareClick} color="light" size="xl" className="text-blue-700 font-bold rounded-none">{value}</Button>
}

// meskipun export defaultnya berubah nama menjadi Board(), ketika dipanggil di dalam main.jsx import nya ngambil dari nama filenya bukan nama functionnya
function Board({ xIsNext, squares, onPlay }) {
  // ini dipindah ke dalam component game untuk lifting up state lagi.
  // const [squares, setSquares] = useState(Array(9).fill(null));
  // const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    // ini buat ngecek apa squares dengan indeks yang dipilih itu sudah ada atau belum dan juga ngecek apakah calculate winner mengembalikan nilai selain false?
    if (squares[i] != null || calculateWinner(squares)) {
      return;
    }
    else {
      // ini artinya akan membuat duplikat array squaares yang baru, jika tidak diberi parameter di slice nya brti akan membuat array yang sama persis (tidak bisa dicacah arraynya)
      const nextSquares = squares.slice();
      // console.log(nextSquares);
      // if(xIsNext){
      //   nextSquares[i] = "X";
      // }
      // else{
      //   nextSquares[i] = "O";
      // }
      nextSquares[i] = (xIsNext) ? "X" : "O";
      onPlay(nextSquares);

      // kedua ini tidak diperlukan lagi karena sudah diatur di dalam function handlePlay dari parameter onPlay
      // setSquares(nextSquares);
      // setXIsNext(!xIsNext);
    }
  }

  // ini buat nampilin siapa yang menang dan giliran selanjutnya, jdi otomatis jalnin function calculatewinner
  const winner = calculateWinner(squares);
  // console.log(winner);
  let status = "";
  if (winner) {
    status = "Winner : " + winner;
  }
  else {
    status = "Next Player : " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <h1 className="text-black font-bold text-2xl mb-3">{status}</h1>
      <div className="grid grid-cols-3 w-80 h-80">
        {
          squares.map((square, index) => (
            // ini onSquareClick dibuat biar hanya berjalan ketika diklik saja biar ga error to many re-renders
            <Square key={index} value={square} onSquareClick={() => handleClick(index)} />
            // kalau mau melemparkan parameter juga di function on click brti harus pakai arrow function
          ))
        }
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ini artinya di dalam array ada array lagi yang masing" nya ada 9 indeks
  // sehingga dapat melakukan tracking history pergerakan tiap simbol X dan O karena tidak menimpa array lagi tapi menambaah array baru di dalam array setiap dilakukan giliran.
  // [
  //   [null, null, null, null, null, null, null, null, null],
  //   ["X", null, null, null, null, null, null, null, null],
  // ]
  const [xIsNext, setXIsNext] = useState(true);
  const [currentMove, setCurrentMove] = useState(0);
  // squares yng akan dikirimkn ke board untuk dislice kemudian dipassing ke handleplay untuk dimasukkan ke dalam arrya history
  const currentSquares = history[currentMove];

  // function ini akan otomatis jalan ketika memanggil komponen board di dalam game
  function handlePlay(nextSquares) {
    // setHistory(history.concat([nextSquares]));

    // ini artinya kalau move pertama mengambil indeks ke-0 saja
    // cara kerja slice itu indeks parameter pertama itu asli, kemudian indek parameter kedua itu tidak disalin, tapi indeks sebelumnya yang disalin
    // jadi ... disebut dengan spread operator yang akan melakukan duplikat array history dari indeks awal hingga indeks gerakan terakhir
    // INI MEMUNGKINKAN TERJDINYA TIME TRAVEL KARENA KETIKA KEMBALI, ARRAAYNYA DIHAPUS SAMPAI INDEKS TERTENTU KEMUDIAN MEMULAI INDEKS GERAKAN YANG BARU!!! 
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    console.log(nextHistory);

    // untuk update isi array history menjadi yang terbaru
    setHistory(nextHistory);

    // ini buat nentuin indeks history terakhir yang nantinya akan diduplikat untuk ditambahkan giliran lainnya
    setCurrentMove(nextHistory.length - 1);

    // ini buat ganti true menjadi false dan sebaliknya sehingga simbol X dan O dapat bergantian
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // ini buat ngatur timeline ke berapa sesuai dengan yang dipilih user (masing" timeline mencatat setiap pergerakan simbol, setiap ada gerakn baru mkaa akan menambah indeks)
    setCurrentMove(nextMove);

    // ini untuk menentukan simbol X dan O ketika berada di history yang genap brti giliran selanjutnya pasti X, kalau ganjil pasti O
    setXIsNext(nextMove % 2 === 0);
  }

  // ini adalah pengondisian pemetaan JSX jadi harus mapakai kurung kurawal setelah arrow, beda dengan ketika kita hanya menampilkan hasil dari array mapping biasa.
  // setiap kondisi harus melakukan return elemen jsx nya
  const moves = history.map((squares, move) => {
    let description = "";
    if (move == 0) {
      description = "Go to Start Point!";
    }
    else {
      description = "Go to Move #" + move;
    }

    return (
      <li key={move}>
        <Button color="blue" onClick={() => jumpTo(move)}>{description}</Button>
      </li>
    );
  });

  return (
    <>
      <div>
        <h1 className="font-bold text-6xl text-white bg-blue-700 text-center mb-10 w-screen h-32 flex justify-center items-center">Tic-Tac-Toe Game</h1>
        <div className="flex flex-row justify-center gap-x-20">
          <div>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          </div>
          <div className="border border-1 rounded-lg border-gray-300 py-6 px-24">
            <h1 className="font-bold text-2xl text-black text-center mb-8">History</h1>
            <ol className="flex flex-col justify-center items-center gap-y-2">
              {moves}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

// function ini ditaruh di luar kedua komponen di atas karena tidak perlu saling passing komponen ini jdi biar bisa dipakai langsung aja
function calculateWinner(squares) {
  // berisi sebuah array yang masing" adalah 3 indeks dimana user bisa menang --> horizontal, vertikal, dan diagonal
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let index = 0; index < lines.length; index++) {
    // ini buat masukin masing" indeks ke dalam variabel a,b,c
    const [a, b, c] = lines[index];

    // dicek apa ketiga indeks aturan tersebut sama semua nilainya atau tidak
    if (squares[a] && (squares[a] === squares[b]) && (squares[a] === squares[c])) {
      return squares[a];
    }
  }
  return false;
}
