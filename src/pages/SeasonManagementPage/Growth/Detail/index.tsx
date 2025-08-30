import {
  Accordion,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  List,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Modal,
  Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconPencil, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import SeedDetailCards from "../../../AreaManagementPage/Region/Add/components/SeedDetailCards";
import { cropOptions, seedOptions } from "../../../AreaManagementPage/Row/Add";
import CropCards from "../Add/components/CropCards";
import SeedCards from "../Add/components/SeedCards";
import { useNavigate } from "react-router-dom";

type CycleStage = { cycleId: string; stageIds: string[] };

const growthCycleOptions = [
  { value: "cycle1", label: "Chu kỳ A" },
  { value: "cycle2", label: "Chu kỳ B" },
  { value: "cycle3", label: "Chu kỳ C" },
];

const growthStageOptions = [
  { value: "stage1", label: "Gieo trồng" },
  { value: "stage2", label: "Nảy mầm" },
  { value: "stage3", label: "Phát triển thân lá" },
  { value: "stage4", label: "Ra hoa" },
  { value: "stage5", label: "Kết trái" },
  { value: "stage6", label: "Thu hoạch" },
];

const SectionHeader = ({ title, onEdit }: { title: string; onEdit: () => void }) => (
  <Group justify="space-between" align="center" mb="xs">
    <Title order={4}>{title}</Title>
    <Button size="xs" variant="light" leftSection={<IconPencil size={14} />} radius={4} onClick={onEdit}>
      Chỉnh sửa
    </Button>
  </Group>
);

const InfoRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <Group justify="space-between" align="center">
    <Text c="dimmed">{label}</Text>
    <Text fw={500}>{value ?? "—"}</Text>
  </Group>
);

type ModalSection = "basic" | "plant" | "cycle";

export default function SeasonManagementGrowthOnePage() {
  const [cycleStageList, setCycleStageList] = useState<CycleStage[]>([
    { cycleId: "cycle1", stageIds: ["stage1", "stage2", "stage3"] },
    { cycleId: "cycle2", stageIds: ["stage4", "stage5", "stage6"] },
  ]);

  const form = useForm({
    initialValues: {
      name: "Mùa xoài Đông Xuân 2025",
      code: "SX-2025-Q1",
      estimatedDuration: 120,
      region: "KV-Đông Nam Bộ",
      description:
        "Mùa vụ tập trung giống xoài cát hoà lộc. Ưu tiên bón hữu cơ, theo dõi sinh trưởng 2 tuần/lần.",
      crop: "Mango",
      seed: "Xoài Cát Hòa Lộc",
      seedDetail: ["Hạt A01", "Hạt A02", "Hạt A03"],
    },
    validate: {
      name: (v) => (!v?.trim() ? "Bắt buộc" : null),
      estimatedDuration: (v) => (v && v > 0 ? null : "Phải > 0"),
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<ModalSection>("basic");

  const openModal = (s: ModalSection) => {
    setModalSection(s);
    setModalOpen(true);
  };

  const cycleLabelOf = (id?: string | null) =>
    growthCycleOptions.find((c) => c.value === id)?.label || id || "—";
  const stageLabelOf = (id: string) =>
    growthStageOptions.find((s) => s.value === id)?.label || id;

  const basicModal = (
    <Stack gap="sm">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput label="Tên mùa vụ" radius={6} {...form.getInputProps("name")} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput label="Mã mùa vụ" radius={6} {...form.getInputProps("code")} />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Thời gian (ngày)"
            min={1}
            radius={6}
            {...form.getInputProps("estimatedDuration")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput label="Khu vực" radius={6} {...form.getInputProps("region")} />
        </Grid.Col>
      </Grid>
      <Textarea label="Mô tả" minRows={3} radius={6} {...form.getInputProps("description")} />
      <Group justify="flex-end" mt="xs">
        <Button onClick={() => setModalOpen(false)} radius={6}>
          Lưu
        </Button>
      </Group>
    </Stack>
  );

  const [plantDraft, setPlantDraft] = useState({
    crop: form.values.crop,
    seed: form.values.seed,
    seedDetail: form.values.seedDetail as string[],
  });

  const plantModal = (
    <Stack gap="md">
      <Stack gap={6}>
        <Text fz={14} fw={600}>
          Cây trồng
        </Text>
        <CropCards
          selected={plantDraft.crop}
          plants={cropOptions}
          isCheckbox={true}
          isTouchable
          isDelete={false}
          onSelect={(v: string) => setPlantDraft((d) => ({ ...d, crop: v }))}
        />
      </Stack>
      <Stack gap={6}>
        <Text fz={14} fw={600}>
          Giống cây trồng
        </Text>
        <SeedCards
          selected={plantDraft.seed}
          seeds={seedOptions}
          isTouchable
          isDelete={false}
          onSelect={(v: string) => setPlantDraft((d) => ({ ...d, seed: v }))}
        />
      </Stack>
      <Stack gap={6}>
        <Group justify="space-between" align="center">
          <Text fz={14} fw={600}>
            Hạt giống
          </Text>
          {!!plantDraft.seedDetail.length && (
            <Button size="xs" variant="subtle" onClick={() => setPlantDraft((d) => ({ ...d, seedDetail: [] }))}>
              Xoá tất cả
            </Button>
          )}
        </Group>
        <SeedDetailCards
          isMultiple
          isTouchable
          isDelete={false}
         
        />
      </Stack>

      <Group justify="flex-end" mt="xs">
        <Button
          radius={6}
          onClick={() => {
            form.setValues({
              ...form.values,
              crop: plantDraft.crop,
              seed: plantDraft.seed,
              seedDetail: plantDraft.seedDetail,
            });
            setModalOpen(false);
          }}
        >
          Lưu
        </Button>
      </Group>
    </Stack>
  );

  const [cycleDraft, setCycleDraft] = useState<CycleStage[]>(cycleStageList);
  const [currentCycle, setCurrentCycle] = useState<string | null>(null);
  const [currentStages, setCurrentStages] = useState<string[]>([]);

  const addDraftCycle = () => {
    if (!currentCycle || currentStages.length === 0) return;
    setCycleDraft((prev) => [...prev, { cycleId: currentCycle, stageIds: currentStages }]);
    setCurrentCycle(null);
    setCurrentStages([]);
  };

  const removeDraftCycle = (i: number) => setCycleDraft((prev) => prev.filter((_, idx) => idx !== i));

  const cycleModal = (
    <Stack>
      <Select
        label="Chu kỳ sinh trưởng"
        data={growthCycleOptions}
        value={currentCycle}
        onChange={setCurrentCycle}
        placeholder="Chọn 1 chu kỳ"
        radius={6}
        searchable
        clearable
      />
      <MultiSelect
        label="Giai đoạn"
        data={growthStageOptions}
        value={currentStages}
        onChange={setCurrentStages}
        placeholder="Chọn nhiều giai đoạn"
        radius={6}
        searchable
        clearable
      />
      <Group justify="flex-end">
        <Button variant="outline" radius={6} onClick={addDraftCycle} disabled={!currentCycle || !currentStages.length}>
          + Thêm chu kỳ
        </Button>
      </Group>

      {cycleDraft.length ? (
        <Accordion multiple variant="separated" mt="sm">
          {cycleDraft.map((item, index) => (
            <Accordion.Item key={index} value={`cycle-${index}`}>
              <Accordion.Control>
                <Group justify="space-between" w="100%">
                  <Text fw={600}>{cycleLabelOf(item.cycleId)}</Text>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    leftSection={<IconTrash size={14} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDraftCycle(index);
                    }}
                  >
                    Xoá
                  </Button>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap={4}>
                  {item.stageIds.map((sid, i) => (
                    <Text key={i} size="sm">
                      • {stageLabelOf(sid)}
                    </Text>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Text c="dimmed">Chưa có chu kỳ nào</Text>
      )}

      <Group justify="flex-end" mt="xs">
        <Button
          radius={6}
          onClick={() => {
            setCycleStageList(cycleDraft);
            setModalOpen(false);
          }}
        >
          Lưu
        </Button>
      </Group>
    </Stack>
  );

  const modalContent = useMemo(() => {
    if (modalSection === "basic") return basicModal;
    if (modalSection === "plant") return plantModal;
    return cycleModal;
  }, [modalSection, basicModal, plantModal, cycleModal]);
  const navigate = useNavigate()
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
        <Title order={3}>Chi tiết mùa vụ</Title>
      </Group>
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card withBorder shadow="sm" radius={8} p="md">
              <SectionHeader title="Thông tin cơ bản" onEdit={() => openModal("basic")} />
              <Divider my="xs" />
              <Stack gap="xs">
                <InfoRow label="Tên mùa vụ" value={form.values.name} />
                <InfoRow label="Mã mùa vụ" value={form.values.code} />
                <InfoRow label="Thời gian (ngày)" value={form.values.estimatedDuration} />
                <InfoRow label="Khu vực" value={form.values.region} />
                <Stack gap={4}>
                  <Text c="dimmed">Mô tả</Text>
                  <Text>{form.values.description || "—"}</Text>
                </Stack>
              </Stack>
            </Card>

            <Card withBorder shadow="sm" radius={8} p="md">
              <SectionHeader title="Cây trồng & Giống" onEdit={() => openModal("plant")} />
              <Divider my="xs" />
              <Stack gap="xs">
                <InfoRow label="Cây trồng" value={form.values.crop || "—"} />
                <InfoRow label="Giống cây trồng" value={form.values.seed || "—"} />
                <Group justify="space-between" align="flex-start">
                  <Text c="dimmed">Hạt giống</Text>
                  {form.values.seedDetail?.length ? (
                    <List size="sm">
                      {form.values.seedDetail.map((x, i) => (
                        <List.Item key={i}>{x}</List.Item>
                      ))}
                    </List>
                  ) : (
                    <Text fw={500}>—</Text>
                  )}
                </Group>
                <Group>
                  {form.values.crop && <Badge>{form.values.crop}</Badge>}
                  {form.values.seed && <Badge variant="light">{form.values.seed}</Badge>}
                  {!!form.values.seedDetail?.length && (
                    <Badge variant="outline">{form.values.seedDetail.length} hạt giống</Badge>
                  )}
                </Group>
              </Stack>
            </Card>

           
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder shadow="sm" radius={8} p="md">
              <SectionHeader title="Chu kỳ & Giai đoạn" onEdit={() => {
                setCycleDraft(cycleStageList);
                openModal("cycle");
              }} />
              <Divider my="xs" />
              {cycleStageList.length === 0 ? (
                <Text c="dimmed">Chưa có chu kỳ nào.</Text>
              ) : (
                <Accordion multiple variant="separated">
                  {cycleStageList.map((item, index) => (
                    <Accordion.Item key={index} value={`cycle-${index}`}>
                      <Accordion.Control>
                        <Group justify="space-between" w="100%">
                          <Text fw={600}>{cycleLabelOf(item.cycleId)}</Text>
                          <Badge>{item.stageIds.length} giai đoạn</Badge>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap={4}>
                          {item.stageIds.map((sid, i) => (
                            <Text key={i} size="sm">
                              • {stageLabelOf(sid)}
                            </Text>
                          ))}
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card>
        </Grid.Col>
      </Grid>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalSection === "basic" ? "Sửa thông tin cơ bản" : modalSection === "plant" ? "Sửa cây trồng & giống" : "Sửa chu kỳ & giai đoạn"
        }
        size="lg"
        centered
        radius="md"
      >
        {modalContent}
      </Modal>
    </Card>
  );
}
