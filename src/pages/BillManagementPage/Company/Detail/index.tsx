import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Drawer,
  TextInput,
  Select,
  NumberInput,
  Timeline,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconPhone,
  IconPencil,
  IconCircleCheck,
  IconCircleDashed,
  IconX,
  IconRotate,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type CartItem = {
  id: string;
  name: string;
  img: string;
  quantity: number;
  price: number;
  description?: string;
};

type BillStatus = "pending" | "paid" | "cancelled" | "refunded";

const STATUS_LABEL: Record<BillStatus, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  cancelled: "Đã huỷ",
  refunded: "Hoàn tiền",
};

const STATUS_COLOR: Record<BillStatus, string> = {
  pending: "yellow",
  paid: "green",
  cancelled: "red",
  refunded: "grape",
};

const STATUS_ICON: Record<BillStatus, React.ReactNode> = {
  pending: <IconCircleDashed size={16} />,
  paid: <IconCircleCheck size={16} />,
  cancelled: <IconX size={16} />,
  refunded: <IconRotate size={16} />,
};

const ALLOWED_NEXT: Record<BillStatus, BillStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["refunded"],
  cancelled: [],
  refunded: [],
};

const initialCart: CartItem[] = [
  {
    id: "SP001",
    name: "Mứt sầu riêng Ri6",
    img: "https://mutngon.com/upload/images/sau-rieng-monthong-nguyen-mui-say-thang-hoa-gion-don-mut-ngon-nafarm.jpg",
    quantity: 2,
    price: 150000,
  },
  {
    id: "SP002",
    name: "Cafe hạt nguyên chất",
    img: "https://caphenguyenchat.net/wp-content/uploads/2021/06/ca-phe-nguyen-chat-co-tac-dung-gi-01.jpg",
    quantity: 1,
    price: 120000,
  },
];

const currency = (n: number) => n.toLocaleString("vi-VN") + " VNĐ";

const BillManagementCompanyDetailPage = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const [items, setItems] = useState<CartItem[]>(initialCart);
  const [shippingName, setShippingName] = useState("Trung");
  const [shippingTag, setShippingTag] = useState<"WORK" | "HOME">("WORK");
  const [shippingAddress, setShippingAddress] = useState(
    "PJICO TOWER, 186 Điện Biên Phủ, Hồ Chí Minh, Quận 3, Phường 6"
  );
  const [shippingPhone, setShippingPhone] = useState("0919090084");
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "cod" | "bank">(
    "momo"
  );

  const [billStatus, setBillStatus] = useState<BillStatus>("pending");
  const [statusDraft, setStatusDraft] = useState<BillStatus>(billStatus);
  const [statusHistory, setStatusHistory] = useState<
    { status: BillStatus; at: string }[]
  >([
    { status: "pending", at: "26/07/2025 10:18:06" },
    { status: "paid", at: "26/07/2025 10:18:11" },
  ]);

  const totalPrice = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const handleChangeQty = (id: string, qty: number | string) => {
    const q = typeof qty === "string" ? parseInt(qty || "0", 10) : qty || 0;
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, quantity: Math.max(0, q) } : it
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const paymentLabel = useMemo(() => {
    if (paymentMethod === "momo") return "MoMo E-Wallet";
    if (paymentMethod === "bank") return "Chuyển khoản ngân hàng";
    return "Thanh toán khi nhận hàng (COD)";
  }, [paymentMethod]);

  const applyStatus = () => {
    if (statusDraft === billStatus) return close();
    if (!ALLOWED_NEXT[billStatus].includes(statusDraft)) return;
    setBillStatus(statusDraft);
    setStatusHistory((h) => [
      ...h,
      { status: statusDraft, at: new Date().toLocaleString("vi-VN") },
    ]);
    close();
  };

  return (
    <>
      <Group gap="lg" align="flex-start">
        <Stack flex={1}>
          <Card withBorder radius={4} shadow="sm">
            <Stack gap="xs">
              <Group mb="md" wrap="nowrap">
                <Button
                  variant="subtle"
                  radius={4}
                  leftSection={<IconArrowLeft size={18} />}
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </Button>
                <Title order={4}>Chi tiết đơn hàng (#515582734723982)</Title>
                <Badge
                  ml="sm"
                  color={STATUS_COLOR[billStatus]}
                  variant="filled"
                  radius="sm"
                  leftSection={STATUS_ICON[billStatus]}
                >
                  {STATUS_LABEL[billStatus]}
                </Badge>
                <Button
                  ml="auto"
                  leftSection={<IconPencil size={16} />}
                  onClick={() => {
                    setStatusDraft(billStatus);
                    open();
                  }}
                  radius={4}
                >
                  Chỉnh sửa
                </Button>
              </Group>

              <Group justify="space-between" align="center">
                <Group align="center" gap="xs">
                  <Image
                    src="https://www.colgatepalmolive.com.vn/content/dam/cp-sites/corporate/corporate-2021/our/brands/colgate.png"
                    alt="Colgate"
                    w={30}
                    h={30}
                  />
                  <Text fw={500}>Colgate - Palmolive</Text>
                </Group>
                <Button variant="outline" radius={4}>
                  Nhắn tin cho người bán
                </Button>
              </Group>

              <Divider />

              <Card withBorder radius={4} shadow="sm" p="md">
                <Group align="center" gap="md" justify="space-between">
                  <Group>
                    <Image
                      src="https://play-lh.googleusercontent.com/R6Kzs8sI4-yEqn-o1TVl70l7Adv3M3OHdvT5ZI1knjAfih7zM50XU3UZX0UJy1G2DnM"
                      alt="Standard Delivery"
                      w={40}
                      h={40}
                    />
                    <Stack gap={4}>
                      <Text fw={500}>Nhận hàng trong khoảng 27/5 - 29/5</Text>
                      <Text fw={500} c="green">
                        Standard Delivery
                      </Text>
                    </Stack>
                  </Group>
                  <Text fw={500} c="green">
                    180,000 VNĐ
                  </Text>
                </Group>
              </Card>

              <Divider />

              <Stack gap="md">
                {items.map((item) => (
                  <Group
                    key={item.id}
                    align="flex-start"
                    justify="space-between"
                  >
                    <Group align="center" gap="xs">
                      <Image
                        src={item.img}
                        alt={item.name}
                        w={80}
                        h={80}
                        radius="md"
                      />
                      <Stack gap={4}>
                        <Text fw={600}>{item.name}</Text>
                        <Text size="sm" c="dimmed">
                          Giá: {currency(item.price)}
                        </Text>
                        <Group gap="xs" align="center">
                          <Text size="sm" c="dimmed">
                            Số lượng:
                          </Text>
                          <NumberInput
                            value={item.quantity}
                            onChange={(v) =>
                              handleChangeQty(item.id, v as number)
                            }
                            min={0}
                            w={120}
                          />
                        </Group>
                      </Stack>
                    </Group>
                    <Button
                      variant="transparent"
                      radius={4}
                      onClick={() => handleRemove(item.id)}
                    >
                      Cancel
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>

          <Card withBorder radius={4} shadow="sm" p="md">
            <Stack gap="xs">
              <Title order={4} fw={700}>
                Thông tin giao hàng
              </Title>
              <Divider />
              <Group align="center" gap="xs">
                <Text fw={500} size="lg">
                  {shippingName}
                </Text>
                <Badge color="blue" variant="filled">
                  {shippingTag}
                </Badge>
              </Group>
              <Text fw={400} size="sm" c="dimmed">
                {shippingAddress}
              </Text>
              <Group align="center" gap="xs">
                <IconPhone size={16} color="green" />
                <Text fw={500} size="sm">
                  {shippingPhone}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Stack>

        <Stack flex={1}>
          <Card withBorder radius={4} shadow="sm">
            <Stack gap="xs">
              <Title order={4}>Thông tin thanh toán</Title>
              <Divider />
              <Group justify="space-between">
                <Text fw={500}>Mã đơn hàng:</Text>
                <Text>#515582734723982</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Ngày đặt:</Text>
                <Text>26/07/2025 10:18:06</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Ngày thanh toán:</Text>
                <Text>26/07/2025 10:18:11</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Tên doanh nghiệp:</Text>
                <Text>Colgate - Palmolive</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Mã số thuế:</Text>
                <Text>123456789</Text>
              </Group>
              <Group justify="space-between" align="center">
                <Text fw={500}>Thanh toán bằng:</Text>
                <Group>
                  <Text>{paymentLabel}</Text>
                  <Image
                    src={
                      paymentMethod === "momo"
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnV4cUM7jBauINof35Yn_unOz976Iz5okV8A&s"
                        : "https://upload.wikimedia.org/wikipedia/commons/5/5e/Credit-card-logos.png"
                    }
                    w={20}
                    h={20}
                  />
                </Group>
              </Group>

              <Divider my="sm" />
              <Text fw={500}>Lịch sử trạng thái</Text>
              <Timeline bulletSize={16} lineWidth={2}>
                {statusHistory.map((h, i) => (
                  <Timeline.Item
                    key={i}
                    title={STATUS_LABEL[h.status]}
                    bullet={STATUS_ICON[h.status]}
                    color={STATUS_COLOR[h.status]}
                  >
                    <Text size="sm" c="dimmed">
                      {h.at}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Stack>
          </Card>

          <Card withBorder radius={4} shadow="sm">
            <Stack gap="xs">
              <Title order={4}>Nội dung thanh toán</Title>
              <Divider />
              <Group justify="space-between">
                <Text fw={500}>Tổng phụ ({items.length} sản phẩm):</Text>
                <Text>{currency(totalPrice)}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Phí vận chuyển:</Text>
                <Text>20,100 VNĐ</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Khuyến mãi phí vận chuyển:</Text>
                <Text>-20,100 VNĐ</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Tổng cộng (đã bao gồm VAT):</Text>
                <Text fw={700} c="green">
                  {currency(totalPrice)}
                </Text>
              </Group>
              <Group justify="space-between" align="center">
                <Text fw={500}>Thanh toán bằng:</Text>
                <Group>
                  <Text>{paymentLabel}</Text>
                  <Image
                    src={
                      paymentMethod === "momo"
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnV4cUM7jBauINof35Yn_unOz976Iz5okV8A&s"
                        : "https://upload.wikimedia.org/wikipedia/commons/5/5e/Credit-card-logos.png"
                    }
                    w={20}
                    h={20}
                  />
                </Group>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Group>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size={480}
        title="Chỉnh sửa đơn hàng"
        padding="md"
      >
        <Stack gap="md">
          <Title order={6}>Trạng thái hoá đơn</Title>
          <Select
            value={statusDraft}
            onChange={(v) => setStatusDraft((v as BillStatus) ?? statusDraft)}
            data={[
              { value: "pending", label: STATUS_LABEL.pending },
              {
                value: "paid",
                label: STATUS_LABEL.paid,
                disabled: !ALLOWED_NEXT[billStatus].includes("paid"),
              },
              {
                value: "cancelled",
                label: STATUS_LABEL.cancelled,
                disabled: !ALLOWED_NEXT[billStatus].includes("cancelled"),
              },
              {
                value: "refunded",
                label: STATUS_LABEL.refunded,
                disabled: !ALLOWED_NEXT[billStatus].includes("refunded"),
              },
            ]}
          />

          <Divider />

          <Title order={6}>Thông tin giao hàng</Title>
          <Group grow>
            <TextInput
              label="Tên người nhận"
              value={shippingName}
              onChange={(e) => setShippingName(e.currentTarget.value)}
            />
            <Select
              label="Nhãn"
              data={[
                { value: "WORK", label: "WORK" },
                { value: "HOME", label: "HOME" },
              ]}
              value={shippingTag}
              onChange={(v) => setShippingTag((v as "WORK" | "HOME") ?? "WORK")}
            />
          </Group>
          <TextInput
            label="Địa chỉ"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.currentTarget.value)}
          />
          <TextInput
            label="Số điện thoại"
            value={shippingPhone}
            onChange={(e) => setShippingPhone(e.currentTarget.value)}
            leftSection={<IconPhone size={16} />}
          />

          <Divider />

          <Title order={6}>Sản phẩm</Title>
          <Stack gap="sm">
            {items.map((it) => (
              <Card key={it.id} withBorder radius={4} p="sm">
                <Group justify="space-between" align="center">
                  <Group>
                    <Image src={it.img} w={40} h={40} radius="sm" />
                    <Stack gap={2}>
                      <Text fw={600} size="sm">
                        {it.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {currency(it.price)}
                      </Text>
                    </Stack>
                  </Group>
                  <NumberInput
                    value={it.quantity}
                    onChange={(v) => handleChangeQty(it.id, v as number)}
                    min={0}
                    w={120}
                  />
                </Group>
              </Card>
            ))}
          </Stack>

          <Divider />

          <Title order={6}>Thanh toán</Title>
          <Select
            label="Phương thức"
            data={[
              { value: "momo", label: "MoMo E-Wallet" },
              { value: "bank", label: "Chuyển khoản ngân hàng" },
              { value: "cod", label: "COD" },
            ]}
            value={paymentMethod}
            onChange={(v) =>
              setPaymentMethod((v as "momo" | "bank" | "cod") ?? "momo")
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close} radius={4}>
              Hủy
            </Button>
            <Button onClick={applyStatus} radius={4}>
              Lưu thay đổi
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
};

export default BillManagementCompanyDetailPage;
