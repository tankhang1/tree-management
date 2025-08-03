import { Card, Stack, Text, Group, ThemeIcon, Badge } from "@mantine/core";
import { IconLeaf, IconTag, IconBarcode } from "@tabler/icons-react";

const PlantCategoryCard = ({
  code,
  scientificName,
  vietnameseName,
  eppoCode,
  iccCode,
  group,
  isActive,
  isShorted = false,
  onPress,
}: {
  code: string;
  scientificName: string;
  vietnameseName: string;
  eppoCode: string;
  iccCode: string;
  group: string;
  isShorted?: boolean;
  isActive?: boolean;
  onPress?: (value: string) => void;
}) => {
  return (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      padding="md"
      onClick={() => onPress?.(code)}
      style={{
        transition: "all 0.2s",
        cursor: "pointer",
        borderColor: isActive ? "green" : undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <Stack gap="xs">
        <Group gap="xs">
          <ThemeIcon variant="light" color="green" radius="xl" size="md">
            <IconLeaf size={16} />
          </ThemeIcon>
          <Text fw={600}>{vietnameseName}</Text>
          <Badge variant="light" color="gray">
            {code}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {scientificName}
        </Text>

        {!isShorted && (
          <Stack gap={"xs"}>
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="blue">
                <IconTag size={14} />
              </ThemeIcon>
              <Text size="sm">EPPO: {eppoCode}</Text>
            </Group>

            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="orange">
                <IconBarcode size={14} />
              </ThemeIcon>
              <Text size="sm">ICC: {iccCode}</Text>
            </Group>

            <Badge color="green" variant="light">
              {group}
            </Badge>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default PlantCategoryCard;
