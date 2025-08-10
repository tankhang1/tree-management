// Stepper-based form UI for assigning work by growth cycle & stage (optimized)
import React, { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Grid,
  Image,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  rem,
  Radio,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconCalendar,
  IconChevronDown,
  IconClipboardCheck,
  IconSearch,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
// External components in your project:
import PlanDetail from "./components/PlanDetail";
import ConfirmStep from "./components/ConfirmStep";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import Section from "../../Unplanned/Add/components/Section";
import Scrollable from "../../../../components/Scrollable";

/* ---------------- Types & constants ---------------- */
const CYCLES = ["Chu kỳ 1"] as const;
const STAGES = ["Nảy mầm", "Ra hoa"] as const;

type Item = {
  id: string;
  name: string;
  img?: string;
  unit?: string;
  code?: string;
  inStock?: number;
  minStock?: number;
  brand?: string;
  origin?: string;
  updatedAt?: string;
  price?: number;
};

type PickerType = "machine" | "supply" | "pesticide" | null;

type ResourceItem = {
  type: string; // "Vật tư" | "Thuốc BVTV" | "Thiết bị" | ...
  name?: string;
  amount: number;
  unit?: string;
};

type StageData = {
  cycle: string; // "Chu kỳ 1" | "Chu kỳ 2" ...
  stage: string; // "Gieo trồng" | "Ra hoa" | "Kết trái" ...
  leader: string;
  members: string[];
  resources: ResourceItem[];
};

/* ---------------- Sample data (giữ nguyên của bạn) ---------------- */
const machineTypes: Item[] = [
  {
    id: "MCH01",
    name: "Máy cày Kubota L3218",
    img: "https://kubotadailoi.com/uploads/images/P-1176_L3218_slide.jpg",
    unit: "cái",
    code: "KUB-L3218",
    inStock: 3,
    minStock: 2,
    brand: "Kubota",
    origin: "Nhật Bản",
    updatedAt: "2025-08-08",
    price: 185_000_000,
  },
  {
    id: "MCH04",
    name: "Máy bay nông nghiệp DJI Agras",
    img: "https://agridrone.vn/wp-content/uploads/2023/02/16887_T50_%E6%AD%A3%E4%BE%A7.jpg",
    unit: "cái",
    code: "DJI-AG-T50",
    inStock: 1,
    minStock: 1,
    brand: "DJI",
    origin: "Trung Quốc",
    updatedAt: "2025-08-06",
    price: 330_000_000,
  },
];

const supplies: Item[] = [
  {
    id: "SUP01",
    name: "Béc tưới nhỏ giọt 8L/h",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXj6nfv7JlBEuVoQo0o9DUUXGAnLXXec-JLg&s",
    unit: "cái",
    code: "IRR-DRIP-8L",
    inStock: 1200,
    minStock: 300,
    brand: "Netafim",
    origin: "Israel",
    updatedAt: "2025-08-07",
    price: 3500,
  },
  {
    id: "SUP02",
    name: "Ống HDPE Φ16",
    img: "https://bizweb.dktcdn.net/thumb/1024x1024/100/348/321/products/ong-hdpe-wata-20.jpg?v=1669780765193",
    unit: "m",
    code: "PIPE16",
    inStock: 800,
    minStock: 200,
    brand: "Danko",
    origin: "Việt Nam",
    updatedAt: "2025-08-05",
    price: 6000,
  },
];

const pesticides: Item[] = [
  {
    id: "PES01",
    name: "Thuốc trừ sâu Emamectin 5%",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV9s4k_p9Y4CZNPLFlRhbQPc4GZZvVNSoGVg&s",
    unit: "chai",
    code: "EMA-5",
    inStock: 40,
    minStock: 20,
    brand: "Syngenta",
    origin: "Thụy Sĩ",
    updatedAt: "2025-08-09",
    price: 145000,
  },
  {
    id: "PES02",
    name: "Thuốc trừ nấm Mancozeb 80WP",
    img: "https://nongduochai.vn/images/products/2021/04/13/original/manozeb-80wp_xanh_1kg_1618288208.png",
    unit: "gói",
    code: "MAN-80",
    inStock: 8,
    minStock: 10,
    brand: "UPL",
    origin: "Ấn Độ",
    updatedAt: "2025-08-02",
    price: 38000,
  },
];

/* ---------------- Small utilities ---------------- */
const stageKey = (cycle: string, stage: string) => `${cycle}__${stage}`;

/** debounce nhỏ gọn, đủ dùng cho input search */
function useDebouncedValue<T>(value: T, delay = 200) {
  const [v, setV] = useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

/* ---------------- Reusable row for picker modal (memo) ---------------- */
const ItemRow = React.memo(function ItemRowBase({
  item,
  checked,
  onToggle,
}: {
  item: Item;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      withBorder
      radius="md"
      w={350}
      p="sm"
      shadow={checked ? "md" : "sm"}
      onClick={onToggle}
      style={{
        cursor: "pointer",
        transition:
          "transform .16s ease, box-shadow .16s ease, border-color .16s ease",
        borderColor: checked ? "var(--mantine-color-teal-6)" : undefined,
        transform: checked ? "translateY(-1px)" : "none",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-1px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = checked
          ? "translateY(-1px)"
          : "none")
      }
    >
      <Group align="flex-start" wrap="nowrap" gap="md">
        <Image
          src={item.img || "https://via.placeholder.com/100x100?text=No+Image"}
          alt={item.name}
          w={88}
          h={88}
          radius={4}
          fit="cover"
        />
        <Stack gap={4} flex={1}>
          <Text fw={600} size="sm" lineClamp={1}>
            {item.name}
          </Text>
          <Group gap={6}>
            <Badge variant="light" color="gray">
              Mã: {item.code ?? item.id}
            </Badge>
            {typeof item.inStock === "number" && (
              <Badge
                variant="light"
                color={
                  item.inStock <= (item.minStock ?? 0) ? "orange" : "green"
                }
              >
                Tồn: {item.inStock}
              </Badge>
            )}
          </Group>
          <Group justify="space-between" mt="auto">
            <Text c="dimmed" fz="xs">
              {item.brand ? `Thương hiệu: ${item.brand}` : ""}
            </Text>
            <Checkbox
              radius={4}
              checked={checked}
              onChange={onToggle}
              onClick={(e) => e.stopPropagation()}
            />
          </Group>
        </Stack>
      </Group>
    </Card>
  );
});

/* ---------------- Generic Picker Modal (reusable cho 3 loại) ---------------- */
function ItemPickerModal({
  opened,
  onClose,
  title,
  leadingIcon,
  items,
  selected,
  setSelected,
  picker,
}: {
  picker: Exclude<PickerType, null>;
  opened: boolean;
  onClose: () => void;
  title: string;
  leadingIcon?: React.ReactNode;
  items: Item[];
  selected: Set<string>; // theo id
  setSelected: (next: Set<string>) => void;
}) {
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search, 200);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      [i.name, i.id, i.code, i.brand, i.origin].some((t) =>
        t?.toLowerCase().includes(q)
      )
    );
  }, [items, debounced]);

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(selected);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelected(next);
    },
    [selected, setSelected]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      radius="md"
      title={
        <Group gap="xs">
          {leadingIcon}
          <Text fw="bold">{title}</Text>
        </Group>
      }
      styles={{ content: { paddingTop: rem(6) } }}
    >
      <Stack gap="sm">
        {picker === "pesticide" && (
          <Select
            label="Loại thuốc trừ sâu"
            placeholder="Tìm kiếm loại thuốc trừ sâu"
            radius={4}
            leftSection={<IconSearch size={18} />}
            data={[
              { value: "PEST01", label: "Thuốc trừ sâu A" },
              { value: "PEST02", label: "Thuốc trừ sâu B" },
              { value: "PEST03", label: "Thuốc trừ sâu C" },
              { value: "PEST04", label: "Thuốc trừ sâu D" },
              { value: "PEST05", label: "Thuốc trừ sâu E" },
              { value: "PEST06", label: "Thuốc trừ sâu F" },
            ]}
          />
        )}
        {picker === "supply" && (
          <Select
            label="Loại vật tư"
            placeholder="Tìm kiếm loại vật tư"
            radius={4}
            leftSection={<IconSearch size={18} />}
            data={[
              { value: "MAT01", label: "Cát" },
              { value: "MAT02", label: "Xi măng" },
              { value: "MAT03", label: "Đá" },
              { value: "MAT04", label: "Sắt" },
              { value: "MAT05", label: "Gạch" },
              { value: "MAT06", label: "Ngói" },
            ]}
          />
        )}
        {picker === "machine" && (
          <Select
            radius={4}
            label="Loại máy móc thiết bị"
            placeholder="Tìm kiếm loại máy móc thiết bị"
            leftSection={<IconTruck size={18} />}
            data={[
              { value: "MCH01", label: "Máy cày Kubota" },
              { value: "MCH02", label: "Máy phun thuốc Honda" },
              { value: "MCH03", label: "Máy gặt đập liên hợp Yanmar" },
              { value: "MCH04", label: "Máy bay nông nghiệp DJI Agras" },
              { value: "MCH05", label: "Máy bơm nước Honda WB20XT" },
              { value: "MCH06", label: "Máy trộn bê tông 250L" },
            ]}
          />
        )}

        <TextInput
          label="Tìm kiếm"
          placeholder="Tên, mã, thương hiệu..."
          radius={4}
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        <Scrollable h={160}>
          <Group p="xs" wrap="nowrap">
            {filtered.map((it) => (
              <ItemRow
                key={it.id}
                item={it}
                checked={selected.has(it.id)}
                onToggle={() => toggle(it.id)}
              />
            ))}
          </Group>
        </Scrollable>

        <Group mt="xs" justify="flex-end">
          <Button radius={4} onClick={onClose} disabled={selected.size === 0}>
            Xác nhận
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

/* ---------------- StageBlock (memo) ---------------- */
const StageBlock = React.memo(function StageBlockBase({
  stageData,
  stageIdx,
  onPickerOpen,
  openFilterEmployee,
}: {
  stageData: StageData;
  stageIdx: number;
  onPickerOpen: (type: Exclude<PickerType, null>) => void;
  openFilterEmployee: () => void;
}) {
  return (
    <Stack key={stageIdx} mt="sm">
      <Stack>
        <Stack gap="xs">
          <Group>
            <Text fw={500} fz={15}>
              Trưởng nhóm
            </Text>
            <Button
              variant="light"
              radius={4}
              onClick={openFilterEmployee}
              leftSection={<IconUser size={18} />}
            >
              Chọn trưởng nhóm
            </Button>
          </Group>
          <EmployeeCardList isDelete isMultiple={false} />
        </Stack>

        <Stack gap="xs">
          <Group>
            <Text fw={500} fz={15}>
              Nhân viên tham gia
            </Text>
            <Button
              variant="light"
              radius={4}
              onClick={openFilterEmployee}
              leftSection={<IconUser size={18} />}
            >
              Chọn nhân viên tham gia
            </Button>
          </Group>
          <EmployeeCardList isDelete isMultiple={false} />
        </Stack>
      </Stack>

      <Stack mt="sm">
        <Text fw={500} fz={15}>
          Hạng mục sử dụng
        </Text>

        <Section
          title="Máy móc"
          data={machineTypes}
          onAdd={() => onPickerOpen("machine")}
          onDelete={(id) => console.log("delete", id)}
        />
        <Section
          title="Vật tư"
          data={supplies}
          onAdd={() => onPickerOpen("supply")}
          onDelete={(id) => console.log("delete", id)}
        />
        <Section
          title="Thuốc bảo vệ thực vật"
          data={pesticides}
          onAdd={() => onPickerOpen("pesticide")}
          onDelete={(id) => console.log("delete", id)}
        />
      </Stack>
    </Stack>
  );
});

/* ---------------- Page ---------------- */
export default function PlanManagementAssignAddPage() {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  // Accordion control (outer cycles)
  const [openCycles, setOpenCycles] = useState<string[]>([]); // mở sẵn

  // dùng 1 modal picker cho 3 loại
  const [picker, setPicker] = useState<PickerType>(null);
  const openPicker = useCallback((t: Exclude<PickerType, null>) => {
    setPicker(t);
  }, []);
  const closePicker = useCallback(() => setPicker(null), []);

  // Selected sets theo id (an toàn hơn index)
  const [selectedMachines, setSelectedMachines] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedSupplies, setSelectedSupplies] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedPesticides, setSelectedPesticides] = useState<Set<string>>(
    () => new Set()
  );

  // Modal nhân sự
  const [mode, setMode] = useState<"group" | "dept">("group");

  // Dữ liệu phân công theo giai đoạn (lazy init)
  const [formDataByStage, setFormDataByStage] = useState<StageData[]>(() =>
    CYCLES.flatMap((cycle) =>
      STAGES.map((stage) => ({
        cycle,
        stage,
        leader: "",
        members: [] as string[],
        resources: [{ type: "", amount: 0, unit: "" }],
      }))
    )
  );

  // map index nhanh (tránh findIndex lặp lại)
  const stageIndexMap = useMemo(() => {
    const m = new Map<string, number>();
    formDataByStage.forEach((s, i) => m.set(stageKey(s.cycle, s.stage), i));
    return m;
  }, [formDataByStage]);

  // Group 2 tầng: Chu kỳ → Giai đoạn → items
  const grouped = useMemo(
    () =>
      CYCLES.map((cycle) => {
        const perStage = STAGES.map((stage) => ({
          stage,
          items: formDataByStage.filter(
            (x) => x.cycle === cycle && x.stage === stage
          ),
        })).filter((g) => g.items.length > 0);
        return { cycle, stages: perStage };
      }),
    [formDataByStage]
  );

  const form = useForm({
    initialValues: {
      name: "",
      season: "",
      plan: "KH-XUAN-01",
      growthCycle: "",
      growthStage: "",
      startDate: new Date(),
      endDate: new Date(),
      manager: "",
      supervisor: "",
    },
  });

  const nextStep = useCallback(() => setActive((c) => Math.min(c + 1, 3)), []);
  const prevStep = useCallback(() => setActive((c) => Math.max(c - 1, 0)), []);

  // dữ liệu + state theo loại picker
  const pickerData = useMemo(() => {
    switch (picker) {
      case "machine":
        return {
          title: "Thêm máy móc",
          icon: <IconTruck size={18} />,
          items: machineTypes,
          selected: selectedMachines,
          setSelected: setSelectedMachines,
        };
      case "supply":
        return {
          title: "Thêm mới vật tư",
          icon: <IconClipboardCheck size={18} />,
          items: supplies,
          selected: selectedSupplies,
          setSelected: setSelectedSupplies,
        };
      case "pesticide":
        return {
          title: "Thêm mới thuốc BVTV",
          icon: <IconClipboardCheck size={18} />,
          items: pesticides,
          selected: selectedPesticides,
          setSelected: setSelectedPesticides,
        };
      default:
        return null;
    }
  }, [picker, selectedMachines, selectedSupplies, selectedPesticides]);

  return (
    <Card withBorder radius={8} shadow="sm" p="md">
      {/* Header */}
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo công việc canh tác</Title>
      </Group>

      <Grid>
        <Grid.Col span={form.getValues().plan !== "" ? 8 : 12}>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Stepper active={active} onStepClick={setActive} mb="xl">
              <Stepper.Step label="Bước 1" description="Thông tin chung" />
              <Stepper.Step
                label="Bước 2"
                description="Phân công theo giai đoạn"
              />
              <Stepper.Step label="Bước 3" description="Xác nhận" />
              <Stepper.Completed>
                <Stack align="center" justify="center" mt="xl">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
                    w={200}
                    fit="cover"
                  />
                  <Text fz="h2" ta="center">
                    Thêm mới công việc canh tác thành công!
                  </Text>
                  <Text fz="md" ta="center" c="dimmed">
                    Công việc canh tác mới đã được tạo thành công. Bạn có thể
                    xem lại thông tin chi tiết trong danh sách công việc canh
                    tác.
                  </Text>

                  <Button
                    size="md"
                    mt="md"
                    radius={4}
                    onClick={() => navigate(-1)}
                  >
                    Xác nhận
                  </Button>
                </Stack>
              </Stepper.Completed>
            </Stepper>

            {/* Step 1 */}
            {active === 0 && (
              <Stack gap="xs">
                <Group align="flex-end">
                  <TextInput
                    label="Tên công việc"
                    placeholder="VD: Tưới nước đợt 1"
                    radius={4}
                    leftSection={<IconClipboardCheck size={16} />}
                    {...form.getInputProps("name")}
                    flex={1}
                  />
                </Group>

                <Group grow>
                  <Select
                    label="Mùa vụ"
                    placeholder="Chọn mùa vụ"
                    radius={4}
                    data={["Mùa Xuân 2025", "Mùa Hè 2025"]}
                    {...form.getInputProps("season")}
                  />
                  <Select
                    flex={1}
                    label="Kế hoạch"
                    placeholder="Chọn kế hoạch (popup filter)"
                    radius={4}
                    data={["KH-XUAN-01", "KH-HE-02"]}
                    {...form.getInputProps("plan")}
                  />
                </Group>

                <Group grow>
                  <DateInput
                    label="Thời gian thực hiện dự kiến"
                    radius={4}
                    locale="vi"
                    leftSection={<IconCalendar size={16} />}
                    {...form.getInputProps("startDate")}
                  />
                  <DateInput
                    label="Thời gian hoàn thành dự kiến"
                    radius={4}
                    locale="vi"
                    leftSection={<IconCalendar size={16} />}
                    {...form.getInputProps("endDate")}
                  />
                </Group>

                <Group grow>
                  <Stack gap="xs">
                    <Group>
                      <Text fw={500} fz={15}>
                        Người quản lý
                      </Text>
                      <Button
                        variant="light"
                        radius={4}
                        onClick={openFilterEmployee}
                        leftSection={<IconUser size={18} />}
                      >
                        Chọn quản lý
                      </Button>
                    </Group>
                    <EmployeeCardList isDelete isMultiple={false} />
                  </Stack>
                  <Stack gap="xs">
                    <Group>
                      <Text fw={500} fz={15}>
                        Người kiểm định chất lượng
                      </Text>
                      <Button
                        variant="light"
                        radius={4}
                        onClick={openFilterEmployee}
                        leftSection={<IconUser size={18} />}
                      >
                        Chọn người kiểm định chất lượng
                      </Button>
                    </Group>
                    <EmployeeCardList isDelete isMultiple={false} />
                  </Stack>
                </Group>
              </Stack>
            )}

            {/* Step 2 */}
            {active === 1 && (
              <Stack>
                <Group justify="space-between">
                  <Text fw={600}>Phân công theo chu kỳ & giai đoạn</Text>
                </Group>

                <Accordion
                  multiple
                  radius="md"
                  chevron={<IconChevronDown size={16} />}
                  variant="contained"
                  value={openCycles}
                  onChange={setOpenCycles}
                >
                  {grouped.map(({ cycle, stages }) => (
                    <Accordion.Item key={cycle} value={cycle}>
                      <Accordion.Control>
                        <Group gap="xs">
                          <Text fw={600}>{cycle}</Text>
                          <Badge variant="light" color="blue">
                            {stages.reduce((s, g) => s + g.items.length, 0)}{" "}
                            giai đoạn
                          </Badge>
                        </Group>
                      </Accordion.Control>

                      <Accordion.Panel>
                        <Accordion
                          multiple
                          radius="md"
                          chevron={<IconChevronDown size={16} />}
                          variant="contained"
                          defaultValue={stages.map(
                            (s) => `${cycle}-${s.stage}`
                          )}
                        >
                          {stages.map(({ stage, items }) => (
                            <Accordion.Item
                              key={`${cycle}-${stage}`}
                              value={`${cycle}-${stage}`}
                            >
                              <Accordion.Control>
                                <Group gap="xs">
                                  <Text fw={600}>{stage}</Text>
                                  <Badge variant="light" color="grape">
                                    {items.length}
                                  </Badge>
                                </Group>
                              </Accordion.Control>
                              <Accordion.Panel>
                                <Stack>
                                  {items.map((sd) => {
                                    const idx =
                                      stageIndexMap.get(
                                        stageKey(sd.cycle, sd.stage)
                                      ) ?? -1;
                                    return (
                                      <StageBlock
                                        key={stageKey(sd.cycle, sd.stage)}
                                        stageData={sd}
                                        stageIdx={idx}
                                        onPickerOpen={openPicker}
                                        openFilterEmployee={openFilterEmployee}
                                      />
                                    );
                                  })}
                                </Stack>
                              </Accordion.Panel>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Stack>
            )}

            {/* Step 3 */}
            {active === 2 && <ConfirmStep />}

            {/* Footer actions */}
            {active < 3 && (
              <Group justify="space-between" mt="lg">
                <Button
                  radius={4}
                  onClick={prevStep}
                  disabled={active === 0}
                  variant="default"
                >
                  Quay lại
                </Button>
                {active < 2 ? (
                  <Button radius={4} onClick={nextStep}>
                    Tiếp tục
                  </Button>
                ) : (
                  <Button
                    radius={4}
                    onClick={nextStep}
                    type="submit"
                    color="green"
                  >
                    Hoàn thành
                  </Button>
                )}
              </Group>
            )}
          </form>
        </Grid.Col>

        {form.getValues().plan !== "" && (
          <Grid.Col span={4}>
            <PlanDetail />
          </Grid.Col>
        )}
      </Grid>

      {/* Modal lọc nhân sự */}
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        size="lg"
        title={<Text fw="bold">Lọc nhân sự</Text>}
      >
        <Stack gap="xs">
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb="xs" label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Chọn đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban liên quan"
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Chọn vai trò"
                radius={4}
                data={["Giám đốc", "Tổ trưởng", "Trưởng phòng"]}
              />
            </>
          )}

          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Chọn thành viên từ nhân sự"
            leftSection={<IconSearch size={16} />}
            radius={4}
          />
          <EmployeeCardList isMultiple />
        </Stack>

        <Group mt="md" justify="flex-end">
          <Button
            radius={4}
            variant="outline"
            color="red"
            onClick={closeFilterEmployee}
          >
            Huỷ
          </Button>
          <Button radius={4}>Xác nhận</Button>
        </Group>
      </Modal>

      {/* Generic Picker Modal (dùng chung cho 3 loại) */}
      {pickerData && picker && (
        <ItemPickerModal
          opened={picker !== null}
          picker={picker}
          onClose={closePicker}
          title={pickerData.title}
          leadingIcon={pickerData.icon}
          items={pickerData.items}
          selected={pickerData.selected}
          setSelected={pickerData.setSelected}
        />
      )}
    </Card>
  );
}
