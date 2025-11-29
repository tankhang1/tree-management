import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CloseButton,
  Group,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useMemo, useState } from "react";
import { useSeasonStore } from "../../zustand/seasonStore";
import type { GrowthCycle } from "../../zustand/treeStore";

const SeasonManagementGrowthPage = () => {
  const navigate = useNavigate();
  const seasons = useSeasonStore((state) => state.seasons);

  const [keyword, setKeyword] = useState("");
  const [mainCrops, setMainCrops] = useState<string[]>([]);
  const [growthFilters, setGrowthFilters] = useState<string[]>([]);

  const onClearAll = () => {
    setKeyword("");
    setMainCrops([]);
    setGrowthFilters([]);
  };

  const onAddGrowth = () => {
    navigate(PATH.SEASON_ADD_GROWTH);
  };

  const onGrowthDetail = () => {
    navigate(PATH.SEASON_GROWTH_DETAIL);
  };

  const filteredData = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    return seasons.filter((row) => {
      const matchKeyword = kw
        ? row.name.toLowerCase().includes(kw) ||
          row.id.toLowerCase().includes(kw)
        : true;

      return matchKeyword;
    });
  }, [seasons, keyword, mainCrops, growthFilters]);

  const cropSeasonColumns: MRT_ColumnDef<GrowthCycle>[] = [
    {
      accessorKey: "id",
      header: "Mã mùa vụ",
    },
    {
      accessorKey: "name",
      header: "Mùa vụ",
    },
    {
      accessorKey: "estimatedDuration",
      header: "Thời gian ước tính (ngày)",
      Cell: ({ row }) => `${row.original.estimatedTime} ngày`,
    },
    {
      accessorKey: "cropName",
      header: "Cây trồng",
    },
    {
      accessorKey: "growthCycleName",
      header: "Chu kỳ sinh trưởng",
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c="gray">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onGrowthDetail}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCopy size={18} color="gray" />}
              onClick={onAddGrowth}
            >
              Sao chép
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>

            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý mùa vụ
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddGrowth}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm mùa vụ</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc cây trồng chính, chu kì sinh trưởng
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={onClearAll}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        <Stack gap="sm">
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Ví dụ: Mùa vụ Xuân 2025"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Cây trồng chính"
              description="Ví dụ: Đậu nành, Bắp"
              placeholder="Chọn thông tin"
              data={[
                { value: "Đậu nành", label: "Đậu nành" },
                { value: "Bắp", label: "Bắp" },
                { value: "Lúa", label: "Lúa" },
              ]}
              value={mainCrops}
              onChange={setMainCrops}
            />
            <MultiSelect
              radius={4}
              label="Chu kỳ sinh trưởng"
              description="Ví dụ: Nảy mầm, Ra hoa, Chín"
              placeholder="Chọn thông tin"
              data={[
                { value: "Nảy mầm", label: "Nảy mầm" },
                { value: "Ra hoa", label: "Ra hoa" },
                { value: "Trỗ cờ", label: "Trỗ cờ/Phun râu" },
                { value: "Chín", label: "Chín, Chín sáp" },
              ]}
              value={growthFilters}
              onChange={setGrowthFilters}
            />
          </SimpleGrid>

          {keyword || mainCrops.length > 0 || growthFilters.length > 0 ? (
            <Group gap={8}>
              {keyword && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setKeyword("")} />}
                >
                  Từ khoá: {keyword}
                </Badge>
              )}

              {mainCrops.map((value) => (
                <Badge
                  key={value}
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setMainCrops((prev) =>
                          prev.filter((item) => item !== value)
                        )
                      }
                    />
                  }
                >
                  Cây trồng: {value}
                </Badge>
              ))}

              {growthFilters.map((value) => (
                <Badge
                  key={value}
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setGrowthFilters((prev) =>
                          prev.filter((item) => item !== value)
                        )
                      }
                    />
                  }
                >
                  Chu kỳ: {value}
                </Badge>
              ))}

              <ActionIcon
                variant="subtle"
                onClick={onClearAll}
                title="Xoá tất cả"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          ) : null}
        </Stack>
      </Card>

      <Table columns={cropSeasonColumns} data={filteredData} />
    </Stack>
  );
};

export default SeasonManagementGrowthPage;
