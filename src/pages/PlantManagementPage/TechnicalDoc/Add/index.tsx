import {
  ActionIcon,
  Button,
  Card,
  Divider,
  FileInput,
  Group,
  Image,
  Input,
  MultiSelect,
  NumberInput,
  Stack,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  IconArrowLeft,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import SunEditor from "suneditor-react";
import { useNavigate } from "react-router-dom";
import { useTreeTechnicalDocStore } from "../../../zustand/treeTechnicalDocStore";
import { notifications } from "@mantine/notifications";

type Attachment = { name: string; href: string };
type SpecRow = { k: string; v: string };

const initialValues = {
  templateCode: "TMP-NEW-01",
  imageUrl: "https://img.freepik.com/free-vector/tree_1308-36471.jpg",
  cropName: "Sầu riêng",
  variety: "Ri6",
  seasonality: ["Mùa mưa", "Mùa nắng sớm"],
  difficultyPct: 35,
  tags: ["VietGAP", "Hữu cơ", "Phòng bệnh", "Tưới tiêu"],
  quickChecklist: [
    "Làm đất, lên líp, thoát nước tốt",
    "Hữu cơ 10–15kg/gốc trước mùa mưa",
    "Bẫy côn trùng sinh học",
    "Tưới nhỏ giọt, che gốc khi mưa lớn",
  ],
  specTable: [
    { k: "Mật độ trồng", v: "6 x 6 m (≈278 cây/ha)" },
    { k: "Độ pH đất", v: "5.5 – 6.5" },
    { k: "Nước tưới", v: "3–5 lít/gốc/ngày (tuỳ thời tiết)" },
    { k: "Phủ gốc", v: "Rơm khô/compost 5–10 cm" },
  ] as SpecRow[],
  cultivationTechniques:
    "<ul><li>Trồng theo mô hình VietGAP</li><li>Bón phân hữu cơ định kỳ 3 tháng/lần</li></ul>",
  standards:
    "<p>Áp dụng tiêu chuẩn <strong>VietGAP</strong> và <em>GlobalGAP</em></p>",
  pestSolutions:
    "<p><strong>Rầy nâu:</strong> Sử dụng thuốc sinh học</p><p><strong>Thối rễ:</strong> Xử lý bằng vôi bột và thoát nước tốt</p>",
  author: "AgriLab Team",
};

const PlantManagementTechnicalDocAddPage = () => {
  const navigate = useNavigate();
  const { addDoc, isLoading } = useTreeTechnicalDocStore();
  const [attachments, setAttachments] = useState<Attachment[]>([
    { name: "Quy trình VietGAP.pdf", href: "#" },
    { name: "Lịch bón phân mẫu.xlsx", href: "#" },
  ]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm({
    initialValues,
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
      { k: "Thông số", v: "Giá trị" },
    ]);
  const removeSpecRow = (i: number) =>
    form.setFieldValue(
      "specTable",
      form.values.specTable.filter((_, idx) => idx !== i)
    );

  const addAttachment = () =>
    setAttachments((a) => [...a, { name: "Tài liệu mới.pdf", href: "#" }]);
  const removeAttachment = (i: number) =>
    setAttachments((a) => a.filter((_, idx) => idx !== i));

  const difficultyVal = useMemo(
    () => Math.round(form.values.difficultyPct),
    [form.values.difficultyPct]
  );

  const handleSubmit = async () => {
    const values = form.getValues();
    const payload = {
      ...values,
      quickChecklist: values.quickChecklist,
      attachments: attachments,
    };

    // GỌI HÀM addDoc TỪ STORE MỚI
    const success = await addDoc(payload);

    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Đã tạo tài liệu mới",
        color: "green",
      });
      navigate(-1);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card withBorder radius="md" shadow="sm" p="lg">
        <Stack gap="md">
          <Group>
            <Button
              radius={4}
              variant="subtle"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title order={3}>✨ Tạo tài liệu kỹ thuật cây trồng</Title>
          </Group>
          <Tabs defaultValue="general">
            <Tabs.List grow>
              <Tabs.Tab value="general">Thông tin chung</Tabs.Tab>
              <Tabs.Tab value="specs">Thông số</Tabs.Tab>
              <Tabs.Tab value="content">Nội dung</Tabs.Tab>
              <Tabs.Tab value="files">Tệp</Tabs.Tab>
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
                <Textarea
                  radius={4}
                  label="Tóm tắt nhanh (mỗi dòng một mục)"
                  minRows={2}
                  value={form.values.quickChecklist.join("\n")}
                  onChange={(e) =>
                    form.setFieldValue(
                      "quickChecklist",
                      e.currentTarget.value.split("\n").filter(Boolean)
                    )
                  }
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
                        <IconTrash size={40} />
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
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="specs" pt="md">
              <Stack gap="sm">
                {form.values.specTable.map((row, i) => (
                  <Group key={`${row.k}-${i}`} align="flex-end">
                    <TextInput
                      radius={4}
                      label="Thông số"
                      style={{ flex: 1 }}
                      value={row.k}
                      onChange={(e) => {
                        const next = [...form.values.specTable];
                        next[i] = { ...row, k: e.currentTarget.value };
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
                        next[i] = { ...row, v: e.currentTarget.value };
                        form.setFieldValue("specTable", next);
                      }}
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => removeSpecRow(i)}
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
            </Tabs.Panel>

            <Tabs.Panel value="content" pt="md">
              <Stack gap="md">
                <Stack gap={6}>
                  <Text fw={600}>🌿 Kỹ thuật canh tác</Text>
                  <SunEditor
                    setOptions={{ height: "200px" }}
                    setContents={form.values.cultivationTechniques}
                    onChange={(v) =>
                      form.setFieldValue("cultivationTechniques", v)
                    }
                  />
                </Stack>
                <Stack gap={6}>
                  <Text fw={600}>🏷️ Tiêu chuẩn chất lượng</Text>
                  <SunEditor
                    setOptions={{ height: "180px" }}
                    setContents={form.values.standards}
                    onChange={(v) => form.setFieldValue("standards", v)}
                  />
                </Stack>
                <Stack gap={6}>
                  <Text fw={600}>🐛 Sâu bệnh & Giải pháp</Text>
                  <SunEditor
                    setOptions={{ height: "180px" }}
                    setContents={form.values.pestSolutions}
                    onChange={(v) => form.setFieldValue("pestSolutions", v)}
                  />
                </Stack>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="files" pt="md">
              <Stack gap="sm">
                {attachments.map((a, i) => (
                  <Group key={`${a.name}-${i}`} align="flex-end">
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
                      radius={4}
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

          <Divider />
          <Group justify="flex-end">
            <Button
              radius={4}
              variant="default"
              onClick={() => alert("Đã lưu nháp!")}
            >
              Lưu nháp
            </Button>
            <Button radius={4} type="submit" color="green">
              Tạo tài liệu
            </Button>
          </Group>
        </Stack>
      </Card>
    </form>
  );
};

export default PlantManagementTechnicalDocAddPage;
