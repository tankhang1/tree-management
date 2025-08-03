import {
  ActionIcon,
  Card,
  Group,
  ScrollAreaAutosize,
  Stack,
} from "@mantine/core";
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
} from "@tabler/icons-react";
import { useRef, useState } from "react";

const Scrollable = ({
  children,
  h = 350,
}: {
  children: React.ReactNode;
  h?: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    }
  };
  return (
    <Card withBorder radius={4} p="md" h="100%">
      <Stack pos={"relative"}>
        <ScrollAreaAutosize ref={scrollRef} onScroll={handleScroll}>
          {children}
        </ScrollAreaAutosize>
        <Group
          pos={"absolute"}
          top={(h - 40) / 2}
          justify="space-between"
          w="100%"
        >
          <ActionIcon
            onClick={scrollLeft}
            w={40}
            h={40}
            radius={100}
            bg="rgba(0, 0, 0, 0.4)"
            style={{
              opacity: isAtStart ? 0 : 1,
              visibility: isAtStart ? "hidden" : "visible",
              transition: "opacity 0.3s ease, visibility 0.3s ease",
            }}
          >
            <IconChevronCompactLeft />
          </ActionIcon>
          <ActionIcon
            onClick={scrollRight}
            w={40}
            h={40}
            radius={100}
            bg="rgba(0, 0, 0, 0.4)"
            style={{
              opacity: isAtEnd ? 0 : 1,
              visibility: isAtEnd ? "hidden" : "visible",
              transition: "opacity 0.3s ease, visibility 0.3s ease",
            }}
          >
            <IconChevronCompactRight />
          </ActionIcon>
        </Group>
      </Stack>
    </Card>
  );
};
export default Scrollable;
