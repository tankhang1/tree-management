import {
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Title,
  Image,
  Checkbox,
  ActionIcon,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface SeedDetailCardProps {
  imageUrl: string;
  seedCode: string;
  seedName: string;
  supplier: string;
  origin: string;
  germinationRate: number;
  uniformityRate: number;
  yieldPerHectare: string;
  isMultiple?: boolean;
  isActive?: boolean;
  isDelete?: boolean;
  onClick?: () => void;
}

const SeedDetailCard = ({
  imageUrl,
  seedCode,
  seedName,
  supplier,
  origin,
  germinationRate,
  uniformityRate,
  yieldPerHectare,
  isMultiple = false,
  isActive = false,
  isDelete = false,
  onClick,
}: SeedDetailCardProps) => {
  return (
    <Card
      shadow="md"
      radius="md"
      withBorder
      padding="md"
      w={300}
      h={400}
      style={{
        position: "relative",
        transition: "transform 0.2s ease",
        borderColor: isActive ? "green" : undefined,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={onClick}
    >
      <Card.Section>
        <Image src={imageUrl} height={160} alt={seedName} />
      </Card.Section>

      <Stack gap="xs" mt="sm">
        <Group justify="space-between">
          <Title order={5}>{seedName}</Title>
          <Group gap={"xs"}>
            <Badge color="gray" variant="light">
              {seedCode}
            </Badge>
            {isMultiple && (
              <Checkbox radius={4} checked={isActive} onChange={() => {}} />
            )}
          </Group>
        </Group>

        <Text size="sm" c="dimmed">
          Nhà cung cấp: {supplier}
        </Text>
        <Text size="sm" c="dimmed">
          Xuất xứ: {origin}
        </Text>

        <Group justify="space-between">
          <Text size="sm">
            Tỷ lệ nảy mầm: <b>{germinationRate}%</b>
          </Text>
          <Text size="sm">
            Độ đồng đều: <b>{uniformityRate}%</b>
          </Text>
        </Group>
        <Text size="sm">
          Năng suất: <b>{yieldPerHectare}</b>
        </Text>
        {isDelete && (
          <ActionIcon
            color="red"
            variant="light"
            radius={4}
            pos={"absolute"}
            bottom={10}
            right={10}
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete action here
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
        {/* <Button
          variant="light"
          color="green"
          fullWidth
          rightSection={<IconSeedling size={16} />}
        >
          Xem chi tiết
        </Button> */}
      </Stack>
    </Card>
  );
};

export default SeedDetailCard;
