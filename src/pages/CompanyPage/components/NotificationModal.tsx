import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  FileInput,
  Group,
  Kbd,
  Modal,
  MultiSelect,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconBell,
  IconBolt,
  IconCalendarClock,
  IconCheck,
  IconFile,
  IconMail,
  IconPhone,
  IconPlayerPlay,
  IconReportMoney,
  IconTemplate,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

type Channel = "email" | "zalo";
type NoticeType = "contract" | "payment";

type NotificationPayload = {
  type: NoticeType;
  channels: Channel[];
  title: string;
  recipients: string[];
  message: string;
  scheduleAt?: string | null;
  attachments?: File[];
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onSend?: (payload: NotificationPayload) => void;
  defaultType?: NoticeType;
  defaultRecipients?: string[];
};

const VARS = [
  { value: "{{customerName}}", label: "Tên khách hàng" },
  { value: "{{contractCode}}", label: "Mã hợp đồng" },
  { value: "{{amount}}", label: "Số tiền" },
  { value: "{{dueDate}}", label: "Ngày đến hạn" },
  { value: "{{orderId}}", label: "Mã đơn hàng" },
];

const TEMPLATES: Record<
  NoticeType,
  { key: string; name: string; title: string; body: string }[]
> = {
  contract: [
    {
      key: "new-contract",
      name: "Thông báo hợp đồng mới",
      title: "Thông báo hợp đồng {{contractCode}}",
      body: "Kính gửi {{customerName}},\nHợp đồng {{contractCode}} đã được tạo vào {{dueDate}}. Vui lòng kiểm tra thông tin chi tiết và phản hồi khi cần.\nTrân trọng.",
    },
    {
      key: "contract-remind",
      name: "Nhắc ký hợp đồng",
      title: "Nhắc ký hợp đồng {{contractCode}}",
      body: "Kính gửi {{customerName}},\nHợp đồng {{contractCode}} đang chờ ký. Vui lòng hoàn tất trước {{dueDate}}.\nXin cảm ơn.",
    },
  ],
  payment: [
    {
      key: "payment-due",
      name: "Nhắc thanh toán đến hạn",
      title: "Nhắc thanh toán – {{contractCode}}",
      body: "Kính gửi {{customerName}},\nSố tiền {{amount}} cho hợp đồng {{contractCode}} đến hạn vào {{dueDate}}. Vui lòng thanh toán theo hướng dẫn.\nXin cảm ơn.",
    },
    {
      key: "payment-confirm",
      name: "Xác nhận đã thanh toán",
      title: "Xác nhận thanh toán – {{contractCode}}",
      body: "Kính gửi {{customerName}},\nChúng tôi xác nhận đã nhận thanh toán {{amount}} cho hợp đồng {{contractCode}}.\nCảm ơn bạn đã hợp tác.",
    },
  ],
};

const replaceVars = (tpl: string) =>
  tpl
    .replace("{{customerName}}", "Nguyễn Văn A")
    .replace("{{contractCode}}", "HD-2025-0012")
    .replace("{{amount}}", "15.000.000 VNĐ")
    .replace("{{dueDate}}", "25/09/2025")
    .replace("{{orderId}}", "MV-2025-000123");

export default function NotificationModal({
  opened,
  onClose,
  onSend,
  defaultType = "contract",
  defaultRecipients = [],
}: Props) {
  const [type, setType] = useState<NoticeType>(defaultType);
  const [channels, setChannels] = useState<Channel[]>(["email"]);
  const [title, setTitle] = useState("");
  const [recipients, setRecipients] = useState<string[]>(defaultRecipients);
  const [message, setMessage] = useState("");
  const [vars, setVars] = useState<string | null>(null);
  const [scheduleMode, setScheduleMode] = useState<"now" | "later">("now");
  const [scheduleAt, setScheduleAt] = useState<Date | null>(null);
  const [files, setFiles] = useState<File[] | null>(null);
  const disabled =
    channels.length === 0 || recipients.length === 0 || !title || !message;

  const preview = useMemo(
    () => ({
      title: replaceVars(title || "Xem trước tiêu đề"),
      body: replaceVars(
        message || "Nội dung thông báo sẽ hiển thị ở đây để xem trước."
      ),
    }),
    [title, message]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      radius="xl"
      overlayProps={{ opacity: 0.15, blur: 6 }}
      title={
        <Group gap="xs">
          <ThemeIcon radius="xl" size="lg" variant="light" color={"green"}>
            <IconBell size={18} />
          </ThemeIcon>
          <Title order={4}>Gửi thông báo</Title>
        </Group>
      }
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <SegmentedControl
            value={type}
            w={220}
            onChange={(v) => setType(v as NoticeType)}
            data={[
              {
                value: "contract",
                label: (
                  <Group gap={6}>
                    <IconTemplate size={14} />
                    Hợp đồng
                  </Group>
                ),
              },
              {
                value: "payment",
                label: (
                  <Group gap={6}>
                    <IconReportMoney size={14} />
                    Thanh toán
                  </Group>
                ),
              },
            ]}
            radius="xl"
          />
          <Group gap={8}>
            <Chip value="email">Email</Chip>
            <Chip value="zalo">Zalo</Chip>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Stack gap="sm">
            <TextInput
              label="Tiêu đề"
              placeholder="Nhập tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              radius="md"
            />

            <MultiSelect
              label="Người nhận"
              placeholder={
                channels.includes("email")
                  ? "Nhập email, cách nhau bởi Enter"
                  : "Nhập số điện thoại/Zalo, cách nhau bởi Enter"
              }
              leftSection={
                channels.includes("email") ? (
                  <IconMail size={16} />
                ) : (
                  <IconPhone size={16} />
                )
              }
              data={[]}
              value={recipients}
              onChange={setRecipients}
              searchable
              hidePickedOptions
              radius="md"
              comboboxProps={{ withinPortal: true }}
              clearable
            />

            <Group align="flex-end" gap="xs">
              <Select
                w="100%"
                label="Chèn biến"
                placeholder="Chọn biến để chèn"
                data={VARS}
                value={vars}
                onChange={setVars}
                radius="md"
              />
              <Tooltip label="Chèn vào nội dung">
                <ActionIcon
                  radius="md"
                  variant="light"
                  color="grape"
                  onClick={() =>
                    vars &&
                    setMessage(
                      (m) =>
                        `${m}${
                          m.endsWith(" ") || m.length === 0 ? "" : " "
                        }${vars}`
                    )
                  }
                >
                  <IconBolt size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>

            <Textarea
              autosize
              minRows={7}
              maxRows={14}
              placeholder="Nhập nội dung thông báo"
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
              radius="md"
            />

            <Group gap="xs">
              <Select
                w="100%"
                label="Mẫu nhanh"
                placeholder="Chọn mẫu"
                data={TEMPLATES[type].map((t) => ({
                  value: t.key,
                  label: t.name,
                }))}
                onChange={(k) => {
                  const t = TEMPLATES[type].find((x) => x.key === k);
                  if (t) {
                    setTitle(t.title);
                    setMessage(t.body);
                  }
                }}
                leftSection={<IconTemplate size={16} />}
                radius="md"
              />
            </Group>

            <FileInput
              label="Đính kèm (tùy chọn)"
              placeholder="Chọn tệp"
              leftSection={<IconFile size={16} />}
              multiple
              value={files || []}
              onChange={(f) => setFiles(f)}
              radius="md"
            />

            <Stack>
              <SegmentedControl
                value={scheduleMode}
                onChange={(v) => setScheduleMode(v as "now" | "later")}
                data={[
                  {
                    value: "now",
                    label: (
                      <Group gap={6} justify="center">
                        <IconPlayerPlay size={14} />
                        Gửi ngay
                      </Group>
                    ),
                  },
                  {
                    value: "later",
                    label: (
                      <Group gap={6} justify="center">
                        <IconCalendarClock size={14} />
                        Lên lịch
                      </Group>
                    ),
                  },
                ]}
                radius="xl"
              />
              <DateTimePicker
                value={scheduleAt}
                label="Thời điểm gửi"
                placeholder="Chọn ngày giờ"
                disabled={scheduleMode === "now"}
                radius="md"
              />
            </Stack>
          </Stack>

          <Stack gap="sm">
            <Card withBorder radius="md" shadow="sm" p="md">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Badge variant="light">
                    Xem trước {channels.includes("email") && "Email"}
                    {channels.length === 2 && " + Zalo"}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    Thay nhanh biến bằng <Kbd>{"{{ }}"}</Kbd>
                  </Text>
                </Group>
                <Paper withBorder radius="md" p="md">
                  <Text fw={600}>{preview.title}</Text>
                  <Divider my="xs" />
                  <Text style={{ whiteSpace: "pre-wrap" }}>{preview.body}</Text>
                </Paper>
                <Group gap={8}>
                  {channels.map((c) => (
                    <Badge
                      key={c}
                      color={c === "email" ? "indigo" : "teal"}
                      variant="light"
                    >
                      {c === "email" ? "Email" : "Zalo"}
                    </Badge>
                  ))}
                  <Badge variant="outline">
                    {recipients.length} người nhận
                  </Badge>
                </Group>
                {scheduleMode === "later" && scheduleAt && (
                  <Text size="sm" c="dimmed">
                    Sẽ gửi: {scheduleAt.toLocaleString("vi-VN")}
                  </Text>
                )}
              </Stack>
            </Card>

            <Card withBorder radius="md" p="md">
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  Lưu ý
                </Text>
                <Text size="sm">
                  • Email hỗ trợ định dạng dài và tệp đính kèm.
                </Text>
                <Text size="sm">
                  • Zalo ưu tiên nội dung ngắn gọn (&lt; 1000 ký tự).
                </Text>
                <Text size="sm">
                  • Biến có thể dùng:{" "}
                  <Anchor size="sm" underline="always">
                    {VARS.map((v) => v.value).join(", ")}
                  </Anchor>
                </Text>
              </Stack>
            </Card>
          </Stack>
        </SimpleGrid>

        <Divider />

        <Group justify="space-between">
          <Group gap="xs">
            <Badge color="grape" variant="light">
              {type === "contract"
                ? "Thông báo hợp đồng"
                : "Thông báo thanh toán"}
            </Badge>
            {files?.length ? (
              <Badge variant="outline">{files.length} tệp đính kèm</Badge>
            ) : null}
          </Group>

          <Group>
            <Button variant="default" radius="md" onClick={onClose}>
              Hủy
            </Button>
            <Button
              radius="md"
              leftSection={<IconCheck size={18} />}
              disabled={disabled}
              onClick={() =>
                onSend?.({
                  type,
                  channels,
                  title,
                  recipients,
                  message,
                  scheduleAt:
                    scheduleMode === "later"
                      ? scheduleAt?.toISOString() ?? null
                      : null,
                  attachments: files ?? undefined,
                })
              }
            >
              Gửi thông báo
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}
