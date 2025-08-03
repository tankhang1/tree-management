import {
  Card,
  Text,
  Group,
  Badge,
  Button,
  Stack,
  Title,
  Image,
} from "@mantine/core";
import {
  IconLeaf,
  IconMapPin,
  IconChartBar,
  IconPercentage,
} from "@tabler/icons-react";

interface SeedCardProps {
  seedCode: string;
  name: string;
  provider: string;
  origin: string;
  germinationRate: number;
  yield: number;
  description?: string;
  backgroundImage: string;
  onSelect?: (code: string) => void;
  isActive?: boolean;
}

const SeedCard = ({
  seedCode,
  name,
  provider,
  origin,
  germinationRate,
  yield: seedYield,
  description,
  backgroundImage,
  onSelect,
  isActive = false,
}: SeedCardProps) => {
  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder
      padding="md"
      w={300}
      style={{
        position: "relative",
        transition: "transform 0.2s ease",
        cursor: "pointer",
        borderColor: isActive ? "green" : undefined,
      }}
      onClick={() => onSelect?.(seedCode)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {backgroundImage && (
        <Card.Section>
          <Image src={backgroundImage} height={160} alt={name} fit="cover" />
        </Card.Section>
      )}
      <Group justify="apart" mb="xs" pt={"lg"}>
        <Title order={4} c="green">
          {name}
        </Title>
        <Badge color="gray" variant="light">
          Mã: {seedCode}
        </Badge>
      </Group>

      <Stack gap={6}>
        <Group gap="xs">
          <IconLeaf size={16} />
          <Text size="sm" color="dimmed">
            Nhà cung cấp: {provider}
          </Text>
        </Group>

        <Group gap="xs">
          <IconMapPin size={16} />
          <Text size="sm" color="dimmed">
            Xuất xứ: {origin}
          </Text>
        </Group>

        <Group gap="xs">
          <IconPercentage size={16} />
          <Text size="sm" color="dimmed">
            Tỷ lệ nảy mầm: {germinationRate}%
          </Text>
        </Group>

        <Group gap="xs">
          <IconChartBar size={16} />
          <Text size="sm" color="dimmed">
            Năng suất: {seedYield} tấn/ha
          </Text>
        </Group>

        {description && (
          <Text size="xs" color="gray" mt="xs" lineClamp={2}>
            {description}
          </Text>
        )}
      </Stack>

      <Group justify="right" mt="md">
        <Button variant="light" color="green" size="xs">
          Chi tiết
        </Button>
      </Group>
    </Card>
  );
};

export default SeedCard;
