// All Iceland documentary themed — landscapes, interviews, b-roll
export const thumbImages = [
  "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&h=240&fit=crop&q=80", // 0 river valley
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=240&fit=crop&q=80", // 1 aurora
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop&q=80", // 2 mountain peaks
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=240&fit=crop&q=80", // 3 glacial lake
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=240&fit=crop&q=80", // 4 misty valley
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=240&fit=crop&q=80", // 5 dramatic peak
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=240&fit=crop&q=80", // 6 portrait woman
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=240&fit=crop&q=80", // 7 portrait man
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&h=240&fit=crop&q=80", // 8 sunset silhouette
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=240&fit=crop&q=80", // 9 waterfall
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=240&fit=crop&q=80", // 10 lake reflection
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=240&fit=crop&q=80", // 11 green hills
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=240&fit=crop&q=80", // 12 starry mountain
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=240&fit=crop&q=80", // 13 snowy peak
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=240&fit=crop&q=80", // 14 calm lake
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=240&fit=crop&q=80", // 15 sun rays valley
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=400&h=240&fit=crop&q=80", // 16 forest mist
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&h=240&fit=crop&q=80", // 17 mountain ridge sunrise
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=240&fit=crop&q=80", // 18 ocean beach
  "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=400&h=240&fit=crop&q=80", // 19 road through mountains
  "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=400&h=240&fit=crop&q=80", // 20 volcanic terrain
  "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=240&fit=crop&q=80", // 21 northern lights green
  "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=400&h=240&fit=crop&q=80", // 22 geyser steam
  "https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=400&h=240&fit=crop&q=80", // 23 cliff edge ocean
  "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&h=240&fit=crop&q=80", // 24 snow field
  "https://images.unsplash.com/photo-1484910292437-025e5d13ce87?w=400&h=240&fit=crop&q=80", // 25 person silhouette mountains
];

export function getHighRes(index: number): string {
  return thumbImages[index].replace("w=400&h=240&q=80", "w=1200&h=675&q=90");
}
