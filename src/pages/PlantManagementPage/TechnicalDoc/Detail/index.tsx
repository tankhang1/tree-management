import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  RingProgress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  TypographyStylesProvider,
  Tabs,
  Input,
  FileInput,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconDownload,
  IconExternalLink,
  IconFileText,
  IconHash,
  IconLifebuoy,
  IconPrinter,
  IconSchema,
  IconSparkles,
  IconTag,
  IconEdit,
  IconUpload,
  IconX,
  IconPhoto,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SunEditor from "suneditor-react";
import { useTreeTechnicalDocStore } from "../../../zustand/treeTechnicalDocStore";
import { notifications } from "@mantine/notifications";

type Attachment = { name: string; href: string };

const initialData = {
  templateCode: "TMP-01",
  imageUrl: "https://img.freepik.com/free-vector/tree_1308-36471.jpg",
  cultivationTechniques:
    "<ul><li>Trồng theo mô hình VietGAP</li><li>Bón phân hữu cơ định kỳ 3 tháng/lần</li></ul>",
  standards:
    "<p>Áp dụng tiêu chuẩn <strong>VietGAP</strong> và <em>GlobalGAP</em></p>",
  pestSolutions:
    "<p><strong>Rầy nâu:</strong> Sử dụng thuốc sinh học</p><p><strong>Thối rễ:</strong> Xử lý bằng vôi bột và thoát nước tốt</p>",
  cropName: "Sầu riêng",
  variety: "Ri6",
  seasonality: ["Mùa mưa", "Mùa nắng sớm"],
  difficulty: 0.35,
  lastUpdated: "2025-08-20 14:10",
  author: "AgriLab Team",
  attachments: [
    { name: "Quy trình VietGAP.pdf", href: "#" },
    { name: "Lịch bón phân mẫu.xlsx", href: "#" },
  ] as Attachment[],
  tags: ["VietGAP", "Hữu cơ", "Phòng bệnh", "Tưới tiêu"],
  specTable: [
    ["Mật độ trồng", "6 x 6 m (≈278 cây/ha)"],
    ["Độ pH đất", "5.5 – 6.5"],
    ["Nước tưới", "3–5 lít/gốc/ngày (tuỳ thời tiết)"],
    ["Phủ gốc", "Rơm khô/compost 5–10 cm"],
  ] as [string, string][],
};

const PlantManagementTechnicalDocDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getDocById, updateDoc, isLoading } = useTreeTechnicalDocStore();
  const [data, setData] = useState(initialData);
  const [opened, { open, close }] = useDisclosure(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>(
    data.attachments
  );

  const form = useForm({
    initialValues: {
      templateCode: data.templateCode,
      imageUrl: data.imageUrl,
      cropName: data.cropName,
      variety: data.variety,
      seasonality: data.seasonality,
      difficultyPct: Math.round(data.difficulty * 100),
      tags: data.tags,
      cultivationTechniques: data.cultivationTechniques,
      standards: data.standards,
      pestSolutions: data.pestSolutions,
      specTable: data.specTable.map(([k, v]) => ({ k, v })), // editable rows
    },
    validate: {
      templateCode: (v) => (!v ? "Bắt buộc" : null),
      cropName: (v) => (!v ? "Bắt buộc" : null),
      variety: (v) => (!v ? "Bắt buộc" : null),
      difficultyPct: (v) => (v >= 0 && v <= 100 ? null : "0–100"),
    },
  });

  const onDropImage = (files: File[]) => {
    const f = files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const url = String(r.result);
      setImagePreview(url);
      form.setFieldValue("imageUrl", url);
    };
    r.readAsDataURL(f);
  };

  const addSpecRow = () =>
    form.setFieldValue("specTable", [
      ...form.values.specTable,
      { k: "Thông số mới", v: "Giá trị" },
    ]);
  const removeSpecRow = (idx: number) =>
    form.setFieldValue(
      "specTable",
      form.values.specTable.filter((_, i) => i !== idx)
    );

  const addAttachment = () =>
    setAttachments((a) => [...a, { name: "Tài liệu mới.pdf", href: "#" }]);
  const removeAttachment = (idx: number) =>
    setAttachments((a) => a.filter((_, i) => i !== idx));

  const save = async (values: typeof form.values) => {
    if (!id) return;
    // GỌI HÀM updateDoc TỪ STORE MỚI
    const success = await updateDoc(id, values);

    if (success) {
      notifications.show({
        title: "Cập nhật thành công",
        color: "green",
        message: "",
      });
      close();
      setData({ ...data, ...values } as any);
    }
  };

  return (
    <>
      <Card withBorder radius="md" shadow="sm" p="lg">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Group>
              <Button
                radius={4}
                variant="subtle"
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
              <Stack gap={2}>
                <Title order={3}>📘 Tài liệu kỹ thuật cây trồng</Title>
                <Group gap="xs">
                  <Badge variant="dot" color="gray">
                    Mã mẫu: {data.templateCode}
                  </Badge>
                  <Badge leftSection={<IconTag size={12} />}>
                    {data.cropName}
                  </Badge>
                  <Badge variant="outline">{data.variety}</Badge>
                </Group>
              </Stack>
            </Group>
            <Group gap="xs">
              <Tooltip label="Sửa">
                <Button
                  radius={4}
                  onClick={() => {
                    setImagePreview(null);
                    setAttachments(data.attachments);
                    form.reset();
                    open();
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Tooltip>
            </Group>
          </Group>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper withBorder radius="md" p="sm">
                <Image
                  src={data.imageUrl}
                  alt="Ảnh minh hoạ"
                  height={260}
                  fit="contain"
                  radius="md"
                />
              </Paper>

              <Card withBorder radius="md" mt="md" p="md">
                <Group justify="space-between">
                  <Group gap="xs">
                    <IconClock size={16} />
                    <Text size="sm" c="dimmed">
                      Cập nhật: {data.lastUpdated}
                    </Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Biên soạn: {data.author}
                  </Text>
                </Group>
                <Divider my="sm" />
                <SimpleGrid cols={2}>
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed">
                      Mùa vụ
                    </Text>
                    <Group gap={6} wrap="wrap">
                      {data.seasonality.map((s) => (
                        <Badge key={s} variant="light">
                          {s}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                  <Stack gap={2} align="center">
                    <Text size="xs" c="dimmed">
                      Mức độ áp dụng
                    </Text>
                    <RingProgress
                      size={64}
                      thickness={8}
                      sections={[
                        {
                          value: Math.round(data.difficulty * 100),
                          color: "teal",
                        },
                      ]}
                      label={
                        <Text size="xs">
                          {Math.round(data.difficulty * 100)}%
                        </Text>
                      }
                    />
                  </Stack>
                </SimpleGrid>
              </Card>

              <Card withBorder radius="md" mt="md" p="md">
                <Group gap={6} mb={6}>
                  <IconHash size={16} />
                  <Text fw={600}>Từ khoá</Text>
                </Group>
                <Group gap={6} wrap="wrap">
                  {data.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </Group>
              </Card>

              <Card withBorder radius="md" mt="md" p="md">
                <Group gap={6} mb={6}>
                  <IconFileText size={16} />
                  <Text fw={600}>Tài liệu đính kèm</Text>
                </Group>
                <Stack gap={6}>
                  {data.attachments.map((a) => (
                    <Group key={a.name} gap="xs">
                      <Anchor href={a.href} target="_blank">
                        {a.name}
                      </Anchor>
                      <IconExternalLink size={14} />
                    </Group>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card withBorder radius="md" p="md">
                <Group gap={6} mb={6}>
                  <IconSparkles size={16} />
                  <Text fw={600}>Tóm tắt nhanh</Text>
                </Group>
                <Stack gap={6}>
                  {[
                    "Làm đất, lên líp, thoát nước tốt",
                    "Hữu cơ 10–15kg/gốc trước mùa mưa",
                    "Bẫy côn trùng sinh học",
                    "Tưới nhỏ giọt, che gốc khi mưa lớn",
                  ].map((c) => (
                    <Group key={c} gap={8}>
                      <IconCheck
                        size={16}
                        color="var(--mantine-color-teal-6)"
                      />
                      <Text>{c}</Text>
                    </Group>
                  ))}
                </Stack>
              </Card>

              <Card withBorder radius="md" mt="md" p="md">
                <Group gap={6} mb={6}>
                  <IconSchema size={16} />
                  <Text fw={600}>Thông số kỹ thuật</Text>
                </Group>
                <Table withTableBorder withColumnBorders highlightOnHover>
                  <Table.Tbody>
                    {data.specTable.map(([k, v]) => (
                      <Table.Tr key={k}>
                        <Table.Td width="40%">
                          <Text c="dimmed">{k}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text>{v}</Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>

              <Card withBorder radius="md" mt="md" p="md">
                <Text fw={600} mb={6}>
                  🌿 Kỹ thuật canh tác
                </Text>
                <TypographyStylesProvider>
                  <ScrollArea.Autosize mah={220} type="hover">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.cultivationTechniques,
                      }}
                    />
                  </ScrollArea.Autosize>
                </TypographyStylesProvider>
              </Card>

              <Card withBorder radius="md" mt="md" p="md">
                <Text fw={600} mb={6}>
                  🏷️ Tiêu chuẩn chất lượng
                </Text>
                <TypographyStylesProvider>
                  <div dangerouslySetInnerHTML={{ __html: data.standards }} />
                </TypographyStylesProvider>
              </Card>

              <Card withBorder radius="md" mt="md" p="md">
                <Text fw={600} mb={6}>
                  🐛 Sâu bệnh & Giải pháp
                </Text>
                <TypographyStylesProvider>
                  <div
                    dangerouslySetInnerHTML={{ __html: data.pestSolutions }}
                  />
                </TypographyStylesProvider>
                <Divider my="sm" />
                <Group gap={8}>
                  <IconLifebuoy size={16} />
                  <Text size="sm" c="dimmed">
                    Ưu tiên biện pháp sinh học; tham khảo nhãn thuốc và quy định
                    địa phương trước khi xử lý.
                  </Text>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        radius="md"
        centered
        title={<Title order={4}>Sửa tài liệu kỹ thuật</Title>}
      >
        <form onSubmit={form.onSubmit(save)}>
          <Tabs defaultValue="general">
            <Tabs.List grow>
              <Tabs.Tab value="general">Thông tin chung</Tabs.Tab>
              <Tabs.Tab value="content">Nội dung</Tabs.Tab>
              <Tabs.Tab value="files">Tệp đính kèm</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="general" pt="md">
              <Stack gap="sm">
                <Group grow>
                  <TextInput
                    radius={4}
                    label="Mã mẫu"
                    {...form.getInputProps("templateCode")}
                  />
                  <TextInput
                    radius={4}
                    label="Cây trồng"
                    {...form.getInputProps("cropName")}
                  />
                  <TextInput
                    radius={4}
                    label="Giống"
                    {...form.getInputProps("variety")}
                  />
                </Group>
                <Group grow>
                  <MultiSelect
                    radius={4}
                    label="Mùa vụ"
                    data={["Mùa mưa", "Mùa nắng sớm", "Chính vụ", "Nghịch vụ"]}
                    {...form.getInputProps("seasonality")}
                  />
                  <NumberInput
                    radius={4}
                    label="Mức độ áp dụng (%)"
                    min={0}
                    max={100}
                    {...form.getInputProps("difficultyPct")}
                  />
                </Group>
                <MultiSelect
                  radius={4}
                  label="Từ khoá"
                  data={form.values.tags}
                  {...form.getInputProps("tags")}
                />
                <Input.Wrapper label="Ảnh minh hoạ">
                  <Dropzone
                    onDrop={onDropImage}
                    onReject={() => {}}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={140}
                      style={{ pointerEvents: "none" }}
                    >
                      <Dropzone.Accept>
                        <IconUpload size={40} />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX size={40} />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconPhoto size={40} />
                      </Dropzone.Idle>
                      <Text size="sm">Kéo & thả ảnh (tối đa 5MB)</Text>
                    </Group>
                  </Dropzone>
                </Input.Wrapper>
                {(imagePreview || form.values.imageUrl) && (
                  <Image
                    src={imagePreview || form.values.imageUrl}
                    h={140}
                    fit="contain"
                    radius="md"
                  />
                )}
                <Divider />
                <Text fw={600}>Thông số kỹ thuật</Text>
                <Stack gap="xs">
                  {form.values.specTable.map((row, idx) => (
                    <Group key={idx} align="flex-end">
                      <TextInput
                        radius={4}
                        label="Thông số"
                        style={{ flex: 1 }}
                        value={row.k}
                        onChange={(e) => {
                          const next = [...form.values.specTable];
                          next[idx] = { ...row, k: e.currentTarget.value };
                          form.setFieldValue("specTable", next);
                        }}
                      />
                      <TextInput
                        radius={4}
                        label="Giá trị"
                        style={{ flex: 2 }}
                        value={row.v}
                        onChange={(e) => {
                          const next = [...form.values.specTable];
                          next[idx] = { ...row, v: e.currentTarget.value };
                          form.setFieldValue("specTable", next);
                        }}
                      />
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => removeSpecRow(idx)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  ))}
                  <Button
                    radius={4}
                    variant="outline"
                    leftSection={<IconPlus size={16} />}
                    onClick={addSpecRow}
                  >
                    Thêm dòng
                  </Button>
                </Stack>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="content" pt="md">
              <Stack gap="sm">
                <Text fw={600}>Kỹ thuật canh tác</Text>
                <SunEditor
                  setOptions={{ height: "160px" }}
                  setContents={form.values.cultivationTechniques}
                  onChange={(v) =>
                    form.setFieldValue("cultivationTechniques", v)
                  }
                />
                <Text fw={600}>Tiêu chuẩn chất lượng</Text>
                <SunEditor
                  setOptions={{ height: "160px" }}
                  setContents={form.values.standards}
                  onChange={(v) => form.setFieldValue("standards", v)}
                />
                <Text fw={600}>Sâu bệnh & Giải pháp</Text>
                <SunEditor
                  setOptions={{ height: "160px" }}
                  setContents={form.values.pestSolutions}
                  onChange={(v) => form.setFieldValue("pestSolutions", v)}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="files" pt="md">
              <Stack gap="sm">
                {attachments.map((a, i) => (
                  <Group key={`${a.name}-${i}`} align="center">
                    <TextInput
                      radius={4}
                      label="Tên tệp"
                      style={{ flex: 2 }}
                      value={a.name}
                      onChange={(e) =>
                        setAttachments((arr) =>
                          arr.map((x, idx) =>
                            idx === i
                              ? { ...x, name: e.currentTarget.value }
                              : x
                          )
                        )
                      }
                    />
                    <FileInput
                      radius={4}
                      label="Liên kết"
                      style={{ flex: 3 }}
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => removeAttachment(i)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="outline"
                  leftSection={<IconPlus size={16} />}
                  onClick={addAttachment}
                >
                  Thêm tệp
                </Button>
              </Stack>
            </Tabs.Panel>
          </Tabs>

          <Group justify="flex-end" mt="md">
            <Button radius={4} variant="default" onClick={close}>
              Hủy
            </Button>
            <Button radius={4} type="submit" color="green">
              Lưu thay đổi
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default PlantManagementTechnicalDocDetailPage;
