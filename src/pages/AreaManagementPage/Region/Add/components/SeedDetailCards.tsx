import { Group } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import SeedDetailCard from "./SeedDetailCard";
import { useState } from "react";

type SeedDetailCardsProps = {
  isMultiple?: boolean;
};
const SeedDetailCards = ({ isMultiple }: SeedDetailCardsProps) => {
  const [selectedSeeds, setSelectedSeeds] = useState<string[]>([]);
  const onSelectSeed = (seedCode: string) => {
    if (!isMultiple) {
      setSelectedSeeds([seedCode]);
      return;
    }
    if (!selectedSeeds.includes(seedCode)) {
      setSelectedSeeds((prev) => [...prev, seedCode]);
    } else {
      setSelectedSeeds((prev) => prev.filter((code) => code !== seedCode));
    }
  };
  return (
    <Scrollable>
      <Group p={"xs"}>
        <SeedDetailCard
          imageUrl="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRF920kXckailuzG5kCZA9hot1dX20ojROkZ9kD8nxA2bHwtoMg5rDkw5dYgHoWk3MCAaGzLMDI2mQOUH4MpEmsBb0qW75ztoQP3s9EaG09"
          seedCode="SR-RI6"
          seedName="Giống Ri6"
          supplier="Công ty Nông sản Việt"
          origin="Việt Nam"
          germinationRate={85}
          isMultiple={isMultiple}
          uniformityRate={60}
          yieldPerHectare="25 tấn/ha"
          isActive={selectedSeeds.includes("SR-RI6")}
          onClick={() => {
            onSelectSeed("SR-RI6");
          }}
        />

        <SeedDetailCard
          imageUrl="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQiblfqVQqly5tgtaoImJtTPktkWocNp-AVL8o3-CrzhjHitexomf2LMeZwPxSzq0nOITwjGJ8GNa5Z_UHajdb9pFYug4NqfXN0fGVOvQM"
          seedCode="SR-MS"
          seedName="Giống Musan"
          supplier="Công ty Nông sản Việt"
          origin="Việt Nam"
          germinationRate={85}
          isMultiple={isMultiple}
          uniformityRate={60}
          yieldPerHectare="25 tấn/ha"
          isActive={selectedSeeds.includes("SR-MS")}
          onClick={() => {
            onSelectSeed("SR-MS");
          }}
        />
        <SeedDetailCard
          imageUrl="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQiblfqVQqly5tgtaoImJtTPktkWocNp-AVL8o3-CrzhjHitexomf2LMeZwPxSzq0nOITwjGJ8GNa5Z_UHajdb9pFYug4NqfXN0fGVOvQM"
          seedCode="SR-TH"
          seedName="Giống Thái"
          supplier="Công ty Nông sản Việt"
          origin="Việt Nam"
          isMultiple={isMultiple}
          germinationRate={85}
          uniformityRate={60}
          yieldPerHectare="25 tấn/ha"
          isActive={selectedSeeds.includes("SR-TH")}
          onClick={() => {
            onSelectSeed("SR-TH");
          }}
        />
      </Group>
    </Scrollable>
  );
};
export default SeedDetailCards;
