import {
  Stepper,
  TextInput,
  Button,
  Group,
  Stack,
  Card,
  FileButton,
  Text,
  Title,
  Badge,
  Divider,
  Grid,
  SegmentedControl,
  Select,
  SimpleGrid,
  ScrollArea,
  Flex,
  Input,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  IconArrowLeft,
  IconBuildingFactory,
  IconCheck,
  IconDownload,
  IconMail,
  IconMapPin,
  IconPlant2,
  IconSearch,
  IconSpray,
  IconTools,
  IconTractor,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import AreaCard from "./components/AreaCard";
import { SelectableEnterpriseCards } from "./components/SelectableEnterpriseCards";

type WarehouseItem = {
  group: string;
  name: string;
  quantity: number;
  unit: string;
  packing: string;
};
const warehouseTypes = [
  {
    icon: <IconBuildingFactory size={32} />,
    title: "Kho lạnh",
    desc: "Bảo quản thực phẩm, dược phẩm, hóa chất",
  },
  {
    icon: <IconMapPin size={32} />,
    title: "Kho khô",
    desc: "Lưu trữ quần áo, đồ gia dụng",
  },
  {
    icon: <IconBuildingFactory size={32} />,
    title: "Kho nguyên liệu",
    desc: "Nguyên liệu cho sản xuất",
  },
  {
    icon: <IconMapPin size={32} />,
    title: "Kho ngoại quan",
    desc: "Hàng chưa thông quan",
  },
  {
    icon: <IconBuildingFactory size={32} />,
    title: "Kho CFS",
    desc: "Gom hàng, đóng container",
  },
  {
    icon: <IconUser size={32} />,
    title: "Kho tự quản",
    desc: "Doanh nghiệp quản lý riêng",
  },
  {
    icon: <IconMail size={32} />,
    title: "Kho TMĐT",
    desc: "Đơn hàng trực tuyến",
  },
  {
    icon: <IconUser size={32} />,
    title: "Kho chung",
    desc: "Dịch vụ lưu trữ chia sẻ",
  },
];

const areaGroups = [
  {
    parentId: "KV001",
    parentName: "Khu vực A",
    latitude: 10.762622,
    longitude: 106.660172,
    areaSize: 1200,
    note: "Khu vực gần hồ nước",
    subAreaCount: 2,
    children: [
      {
        id: "KV001-1",
        name: "Khu phụ A1",
        latitude: 10.763,
        longitude: 106.661,
        areaSize: 500,
      },
      {
        id: "KV001-2",
        name: "Khu phụ A2",
        latitude: 10.764,
        longitude: 106.662,
        areaSize: 700,
      },
    ],
  },
  {
    parentId: "KV002",
    parentName: "Khu vực B",
    latitude: 10.776889,
    longitude: 106.700806,
    areaSize: 900,
    note: "Không phân chia",
    subAreaCount: 0,
    children: [],
  },
];
const assetTypes = [
  {
    label: "Thuốc BVTV",
    value: "Thuốc bảo vệ thực vật",
    icon: <IconSpray size={18} />,
  },
  {
    label: "Vật tư",
    value: "Vật tư",
    icon: <IconTools size={18} />,
  },
  {
    label: "Phân bón",
    value: "Phân bón",
    icon: <IconPlant2 size={18} />,
  },
  {
    label: "Máy móc",
    value: "Máy móc",
    icon: <IconTractor size={18} />,
  },
];
const company = {
  id: "ent-2",
  name: "HTX Nông nghiệp Bền Vững",
  type: "hợp tác xã",
  owner: "Trần Thị B",
  cccd: "123456789012",
  phone: "0938123456",
  email: "info@benvungcoop.vn",
  address: "Xã Phú Riềng, huyện Phú Riềng, Bình Phước",
  taxCode: "0401234567",
  landCode: "HTX-98765432",
};

export default function StockManagementAddDeliveryPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [importedItems, setImportedItems] = useState<WarehouseItem[]>([
    {
      group: "Phân bón",
      name: "Phân NPK 16-16-8",
      quantity: 100,
      unit: "bao",
      packing: "25kg/bao",
    },
    {
      group: "BVTV",
      name: "Thuốc trừ sâu",
      quantity: 30,
      unit: "chai",
      packing: "100ml",
    },
    {
      group: "Máy móc",
      name: "Máy xịt thuốc chạy điện",
      quantity: 2,
      unit: "cái",
      packing: "1 bộ/đơn vị",
    },
  ]);
  const [inputMode, setInputMode] = useState<"upload" | "manual">("upload");
  const form = useForm<{
    warehouseName: string;
    areaId: string;
    areaDetail: string;
  }>({
    initialValues: {
      warehouseName: "",
      areaId: "",
      areaDetail: "",
    },
  });

  const handleUploadFile = () => {
    setImportedItems([
      {
        group: "Phân bón",
        name: "Phân NPK 16-16-8",
        quantity: 100,
        unit: "bao",
        packing: "25kg/bao",
      },
      {
        group: "BVTV",
        name: "Thuốc trừ sâu",
        quantity: 30,
        unit: "chai",
        packing: "100ml",
      },
      {
        group: "Máy móc",
        name: "Máy xịt thuốc chạy điện",
        quantity: 2,
        unit: "cái",
        packing: "1 bộ/đơn vị",
      },
    ]);
  };

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo mới kho vận</Title>
      </Group>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        size="md"
      >
        <Stepper.Step label="Bước 1" description="Xác định vị trí">
          <form onSubmit={form.onSubmit(() => setActive(1))}>
            <Stack gap="xs">
              <TextInput
                label="Doanh nghiệp / hộ nông dân (chọn một)"
                placeholder="Tìm kiếm doanh nghiệp"
                leftSection={<IconSearch size={18} />}
              />
              <SelectableEnterpriseCards isCheckbox={false} isMulti={false} />
              <Text fw={500} fz={15}>
                Chọn khu vực (chọn một)
              </Text>
              <Grid>
                {areaGroups.map((group, index) => (
                  <Grid.Col span={{ base: 12, sm: 6 }} key={group.parentId}>
                    <Card
                      withBorder
                      shadow="xs"
                      radius="md"
                      // onClick={() => handleAreaCardClick(group)}
                      style={{
                        cursor: "pointer",
                        borderColor: index === 0 ? "green" : undefined,
                      }}
                    >
                      <Group justify="apart">
                        <Text fw={600}>{group.parentName}</Text>
                        <Badge color="blue">{group.parentId}</Badge>
                      </Group>
                      <Text size="sm" mt={4}>
                        📍 {group.latitude}, {group.longitude}
                      </Text>
                      <Text size="sm">📏 {group.areaSize} m²</Text>
                      <Text size="sm">🔧 {group.subAreaCount} khu phụ</Text>
                      <Text size="sm" color="dimmed">
                        {group.note}
                      </Text>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
              <Stack gap={"xs"}>
                <Text fw={500} fz={15}>
                  Khu vực phụ (chọn một)
                </Text>
                <Stack>
                  <Group>
                    {[
                      {
                        id: "KV001-1",
                        name: "Khu phụ A1",
                        latitude: 10.763,
                        longitude: 106.661,
                        areaSize: 500,
                      },
                      {
                        id: "KV001-2",
                        name: "Khu phụ A2",
                        latitude: 10.764,
                        longitude: 106.662,
                        areaSize: 700,
                      },
                    ].map((group, index) => (
                      <AreaCard
                        isCheckbox
                        key={group.id}
                        {...group}
                        selected={index === 0}
                        onToggle={() => {}}
                        closable={false}
                      />
                    ))}
                  </Group>
                </Stack>
              </Stack>
              <Group justify="right">
                <Button type="submit" radius={4}>
                  Tiếp theo
                </Button>
              </Group>
            </Stack>
          </form>
        </Stepper.Step>

        <Stepper.Step label="Bước 2" description="Thông tin vật tư">
          <Stack gap="xs">
            <Group>
              {["Khu A - Khu phụ A1 - Kho A"].map((area) => (
                <Card
                  key={area}
                  withBorder
                  shadow="md"
                  radius="4"
                  p="xs"
                  style={{ transition: "transform 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Center>
                    <Group gap="sm">
                      <IconMapPin size={20} color="teal" />
                      <Text fw={600}>{area}</Text>
                    </Group>
                  </Center>
                </Card>
              ))}
            </Group>
            <Card withBorder radius="md" shadow="sm" p="md">
              <Stack>
                <Select
                  label="Kho"
                  data={[
                    "Khu A - Khu phụ A1 - Kho A",
                    "Khu A - Khu phụ A2 - Kho B",
                  ]}
                  radius={4}
                  placeholder="Nhập tên kho mới"
                  withAsterisk
                  {...form.getInputProps("warehouseName")}
                />
                <Input.Wrapper label="Loại kho">
                  <ScrollArea type="always" offsetScrollbars>
                    <Flex gap="md" py="md" px="xs" wrap="nowrap">
                      {warehouseTypes.map((w, idx) => (
                        <Card
                          key={idx}
                          shadow="sm"
                          padding="lg"
                          radius="md"
                          withBorder
                          style={{
                            width: 200,
                            minWidth: 200,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.boxShadow =
                              "0 0 10px rgba(0,0,0,0.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.boxShadow =
                              "var(--mantine-shadow-sm)")
                          }
                        >
                          <Stack align="center" justify="center" gap={4}>
                            {w.icon}
                            <Text size="sm" fw={600}>
                              {w.title}
                            </Text>
                            <Text size="xs" c="dimmed" ta="center">
                              {w.desc}
                            </Text>
                          </Stack>
                        </Card>
                      ))}
                    </Flex>
                  </ScrollArea>
                </Input.Wrapper>
                <SegmentedControl
                  radius={4}
                  fullWidth
                  value={inputMode}
                  onChange={(val) => setInputMode(val as "upload" | "manual")}
                  data={[
                    { label: "Upload file Excel", value: "upload" },
                    { label: "Tạo mới thủ công", value: "manual" },
                  ]}
                />

                {inputMode === "upload" && (
                  <Stack gap={"xs"}>
                    <Group justify="apart">
                      <FileButton
                        onChange={handleUploadFile}
                        accept=".xlsx,.xls"
                      >
                        {(props) => (
                          <Button
                            radius={4}
                            {...props}
                            leftSection={<IconDownload size={16} />}
                          >
                            Upload file Excel
                          </Button>
                        )}
                      </FileButton>
                      <Text size="sm" color="dimmed">
                        Chỉ chấp nhận định dạng .xlsx hoặc .xls
                      </Text>
                    </Group>
                  </Stack>
                )}

                {inputMode === "manual" && (
                  <Stack>
                    <Input.Wrapper label="Loại tài sản">
                      <Group gap="sm" wrap="wrap">
                        {assetTypes.map((type, index) => (
                          <Button
                            key={type.value}
                            leftSection={type.icon}
                            radius={4}
                            variant={index === 0 ? "filled" : "outline"}
                          >
                            {type.label}
                          </Button>
                        ))}
                      </Group>
                    </Input.Wrapper>
                    <TextInput
                      radius={4}
                      label="Nhóm vật tư"
                      placeholder="VD: Phân bón, BVTV, Máy móc"
                      required
                    />

                    <TextInput
                      radius={4}
                      label="Số lượng"
                      placeholder="VD: 100"
                      type="number"
                      required
                    />

                    <Select
                      radius={4}
                      label="Đơn vị"
                      data={["lít", "ml", "g", "kg"]}
                      required
                    />

                    <Select
                      radius={4}
                      label="Quy cách đóng gói"
                      data={["Hộp", "Chai", "Lọ", "Gói"]}
                    />

                    <Button
                      radius={4}
                      variant="light"
                      onClick={() => {
                        // Tạm tạo dữ liệu mẫu; bạn nên dùng useForm để lấy giá trị từ input
                        setImportedItems((prev) => [
                          ...prev,
                          {
                            group: "Phân bón",
                            name: "Phân NPK 16-16-8",
                            quantity: 100,
                            unit: "bao",
                            packing: "25kg/bao",
                          },
                        ]);
                      }}
                    >
                      Thêm vật tư
                    </Button>
                  </Stack>
                )}

                <Divider
                  label="Danh sách vật tư"
                  labelPosition="center"
                  my="sm"
                />

                <Grid gutter="sm">
                  {importedItems.map((item, index) => (
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={index}>
                      <Card shadow="sm" radius="md" withBorder>
                        <Stack gap="xs">
                          <Group justify="space-between">
                            <Text fw={600}>{item.name}</Text>
                            <Badge color="green" variant="light">
                              {item.group}
                            </Badge>
                          </Group>
                          <Text size="sm">Số lượng: {item.quantity}</Text>
                          <Text size="sm">Đơn vị: {item.unit}</Text>
                          <Text size="sm">Quy cách: {item.packing}</Text>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </Stack>
            </Card>

            <Group justify="space-between">
              <Button radius={4} variant="default" onClick={() => setActive(0)}>
                Quay lại
              </Button>
              <Button radius={4} onClick={() => setActive(2)}>
                Tiếp theo
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 3" description="Xác nhận">
          <Stack gap="lg">
            <Title order={3}>🗂️ Xác nhận thông tin kho</Title>

            {/* THÔNG TIN KHO + DOANH NGHIỆP */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {/* Thông tin kho */}
              <Card withBorder radius="md" shadow="sm" p="md">
                <Title order={5} mb="xs">
                  🏬 Kho lưu trữ
                </Title>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Tên kho:
                    </Text>
                    <Text fw={500}>Kho miền nam</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Khu vực đã chọn:
                    </Text>
                    <Text fw={500}>Khu vực A</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Mã khu phụ:
                    </Text>
                    <Text fw={500}>Khu phụ A1</Text>
                  </Group>
                </Stack>
              </Card>

              {/* Doanh nghiệp */}
              <Card withBorder radius="md" shadow="sm" p="md">
                <Title order={5} mb="xs">
                  🏢 {company.name}
                </Title>
                <Stack gap={4}>
                  <Text size="sm">
                    <strong>Loại hình:</strong> {company.type}
                  </Text>
                  <Text size="sm">
                    <strong>Chủ sở hữu:</strong> {company.owner}
                  </Text>
                  <Text size="sm">
                    <strong>CCCD/CMND:</strong> {company.cccd}
                  </Text>
                  <Text size="sm">
                    <strong>Số điện thoại:</strong> {company.phone}
                  </Text>
                  <Text size="sm">
                    <strong>Email:</strong> {company.email}
                  </Text>
                  <Text size="sm">
                    <strong>Địa chỉ:</strong> {company.address}
                  </Text>
                  {company.taxCode && (
                    <Text size="sm">
                      <strong>Mã số thuế:</strong> {company.taxCode}
                    </Text>
                  )}
                  <Text size="sm">
                    <strong>Số sổ đỏ:</strong> {company.landCode}
                  </Text>
                </Stack>
              </Card>
            </SimpleGrid>

            {/* DANH SÁCH VẬT TƯ */}
            <Divider label="Danh sách vật tư" labelPosition="center" my="md" />

            {importedItems.length === 0 ? (
              <Text color="dimmed" ta="center">
                Không có vật tư nào được thêm.
              </Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {importedItems.map((item, index) => (
                  <Card key={index} withBorder shadow="sm" radius="md" p="md">
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text fw={600}>{item.name}</Text>
                        <Badge color="green" variant="light">
                          {item.group}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Số lượng:
                        </Text>
                        <Text size="sm" fw={500}>
                          {item.quantity}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Đơn vị:
                        </Text>
                        <Text size="sm" fw={500}>
                          {item.unit}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Quy cách:
                        </Text>
                        <Text size="sm" fw={500}>
                          {item.packing}
                        </Text>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            )}

            {/* Nút xác nhận */}
            <Group justify="space-between" mt="lg">
              <Button variant="default" radius={4} onClick={() => setActive(1)}>
                Quay lại
              </Button>
              <Button
                radius={4}
                leftSection={<IconCheck size={18} />}
                color="teal"
                onClick={() => alert("✅ Đã lưu thành công!")}
              >
                Xác nhận và lưu
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Completed>
          <Text>🎉 Tạo kho thành công!</Text>
        </Stepper.Completed>
      </Stepper>
    </Card>
  );
}
