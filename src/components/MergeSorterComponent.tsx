import "@styles/global.css";
import React from "react";
import { useState } from "react";

export const MergeSorterComponent = () => {
  const [list, setList] = useState<string[][]>([]);
  const [listIndex1, setListIndex1] = useState<number>(0);
  const [listIndex2, setListIndex2] = useState<number>(0);
  const [itemIndex1, setItemIndex1] = useState<number>(0);
  const [itemIndex2, setItemIndex2] = useState<number>(0);

  const [sortedList, setSortedList] = useState<string[][]>([]);
  const [isSorted, setIsSorted] = useState<boolean>(false);

  const initList = (e: string) => {
    const items = e
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map((item) => [item]);
    setList(items);
    setListIndex1(0);
    setListIndex2(1);
    setItemIndex1(0);
    setItemIndex2(0);
    const sortedListLength = Math.ceil(items.length / 2);
    setSortedList(Array.from({ length: sortedListLength }, () => []));
    setIsSorted(false);
  };

  const handleButtonClick = (isLeftButton: boolean) => {
    // 選択されたアイテムを新しいリストに追加
    const selectedItem = isLeftButton
      ? list[listIndex1][itemIndex1]
      : list[listIndex2][itemIndex2];
    const targetSortedListIndex = Math.floor(listIndex1 / 2);
    const newList = sortedList[targetSortedListIndex] || [];
    newList.push(selectedItem);

    console.log(`clicked ${selectedItem}`);

    // インデックスを更新
    let newItemIndex1 = isLeftButton ? itemIndex1 + 1 : itemIndex1;
    let newItemIndex2 = isLeftButton ? itemIndex2 : itemIndex2 + 1;

    let newListIndex1 = listIndex1;
    let newListIndex2 = listIndex2;

    // 片方のリストのアイテムがなくなった場合
    if (
      newItemIndex1 >= list[listIndex1].length ||
      newItemIndex2 >= list[listIndex2].length
    ) {
      if (isLeftButton) {
        for (let i = newItemIndex2; i < list[listIndex2].length; i++) {
          newList.push(list[listIndex2][i]);
        }
      } else {
        for (let i = newItemIndex1; i < list[listIndex1].length; i++) {
          newList.push(list[listIndex1][i]);
        }
      }
      newItemIndex1 = 0;
      newItemIndex2 = 0;
      newListIndex1 = listIndex1 + 2;
      newListIndex2 = listIndex2 + 2;
    }
    // 次のリストが存在しない場合は再帰を行う
    if (newListIndex1 < list.length && newListIndex2 >= list.length) {
    }

    if (newListIndex1 >= list.length || newListIndex2 >= list.length) {
      setItemIndex1(0);
      setItemIndex2(0);
      setListIndex1(0);
      setListIndex2(1);
      sortedList[targetSortedListIndex] = newList;
      if (newListIndex1 < list.length) {
        sortedList[targetSortedListIndex + 1] = list[newListIndex1] || [];
      }
      setList(sortedList);

      const sortedListLength = Math.ceil(sortedList.length / 2);
      setSortedList(Array.from({ length: sortedListLength }, () => []));

      if (sortedList.length === 1) {
        setIsSorted(true);
      }
      return;
    } else {
      setItemIndex1(newItemIndex1);
      setItemIndex2(newItemIndex2);
      setListIndex1(newListIndex1);
      setListIndex2(newListIndex2);
      sortedList[targetSortedListIndex] = newList;
      setSortedList(sortedList);
    }
  };
  return (
    <div>
      <div className="w-full p-8 rounded-xl bg-white shadow-lg">
        <textarea
          className="w-full h-32 bg-white rounded-xl p-4 resize-none shadow-inner"
          placeholder="改行区切りで要素を入力"
          onChange={(e) => initList(e.target.value)}
        />
      </div>
      <div className="w-full px-8 py-4 mt-4 rounded-xl bg-white shadow-lg">
        {isSorted && <p className="text-center">ソート完了</p>}
        {!isSorted && (
          <>
            <p className="text-center text-neutral-800">どちらが上？</p>
            <hr className="mb-2 mx-2 border-neutral-200" />
            <div className="flex items-center justify-center space-x-4 min-h-20">
              <button
                className="w-full bg-rose-400 text-white px-4 py-2 rounded-full hover:bg-rose-300 transition"
                onClick={() => handleButtonClick(true)}
              >
                {list[listIndex1] ? list[listIndex1][itemIndex1] : ""}
              </button>
              <span className="text-rose-300 text-2xl font-bold"> vs </span>
              <button
                className="w-full bg-rose-400 text-white px-4 py-2 rounded-full hover:bg-rose-300 transition"
                onClick={() => handleButtonClick(false)}
              >
                {list[listIndex2] ? list[listIndex2][itemIndex2] : ""}
              </button>
            </div>
          </>
        )}
      </div>
      <div className="w-full px-8 py-4 mt-4 rounded-xl bg-white shadow-lg">
        <p className="text-center text-neutral-800">ランキング</p>
        <ol className="mx-8 my-4 list-decimal bg-neutral-100 p-4 rounded-xl">
          {list.flat().map((item, index) => (
            <li
              className={
                "w-full rounded-xl shadow-lg p-4 mb-2 list-inside " +
                (() => {
                  if (index === 0) {
                    return "bg-amber-100 text-amber-400 text-lg";
                  } else if (index === 1) {
                    return "bg-zinc-100 text-zinc-400 text-md";
                  } else if (index === 2) {
                    return "bg-orange-100 text-orange-400 text-md";
                  }
                  return "bg-neutral-50 text-neutral-400 text-sm";
                })()
              }
              key={index}
            >
              <span
                className={(() => {
                  if (index === 0) {
                    return "text-amber-700 text-2xl";
                  } else if (index === 1) {
                    return "text-zinc-700 text-lg";
                  } else if (index === 2) {
                    return "text-orange-700 text-lg";
                  }
                  return "text-neutral-800 text-md";
                })()}
              >
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
