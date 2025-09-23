import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  CopyButton,
  Tooltip,
} from "@mantine/core";
import {
  IconCheck,
  IconClock,
  IconCreditCard,
  IconEye,
  IconFileDownload,
  IconId,
  IconMapPin,
  IconPackage,
  IconShoppingBag,
  IconCopy,
} from "@tabler/icons-react";

type SuccessModalProps = {
  opened: boolean;
  onClose: () => void;
  orderId: string;
  totalPrice: number;
  itemsCount: number;
  paymentMethod: string;
  createdAt?: string; // ISO date
  customer?: { name?: string; phone?: string; email?: string };
  shipping?: { address?: string; eta?: string };
  onViewOrder?: () => void;
  onContinue?: () => void;
  onDownloadInvoice?: () => void;
};

const VND = (n: number) => n.toLocaleString("vi-VN");

export default function OrderSuccessModal({
  opened,
  onClose,
  orderId,
  totalPrice,
  itemsCount,
  paymentMethod,
  createdAt,
  customer,
  shipping,
  onViewOrder,
  onContinue,
  onDownloadInvoice,
}: SuccessModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      radius="lg"
      overlayProps={{ opacity: 0.15, blur: 6 }}
      withCloseButton={false}
      padding="lg"
    >
      <Stack gap="md">
        <Group gap="sm" justify="center">
          <ThemeIcon
            size={48}
            radius="xl"
            variant="gradient"
            gradient={{ from: "teal", to: "green" }}
          >
            <IconCheck size={28} />
          </ThemeIcon>
          <Stack gap={0} align="center">
            <Title order={3}>Đặt hàng thành công!</Title>
            <Badge color="teal" variant="light" size="lg">
              Thanh toán thành công
            </Badge>
          </Stack>
        </Group>

        <Paper withBorder radius="md" p="md">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <Group gap="xs">
              <IconId size={18} />
              <Text c="dimmed">Mã đơn</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={600}>{orderId}</Text>
              <CopyButton value={orderId} timeout={1200}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Đã sao chép" : "Sao chép mã"}>
                    <ActionIcon variant="subtle" onClick={copy}>
                      <IconCopy size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>

            <Group gap="xs">
              <IconPackage size={18} />
              <Text c="dimmed">Số sản phẩm</Text>
            </Group>
            <Text fw={600}>{itemsCount}</Text>

            <Group gap="xs">
              <IconCreditCard size={18} />
              <Text c="dimmed">Phương thức</Text>
            </Group>
            <Text fw={600}>{paymentMethod}</Text>

            <Group gap="xs">
              <IconClock size={18} />
              <Text c="dimmed">Ngày đặt</Text>
            </Group>
            <Text fw={600}>
              {createdAt
                ? new Date(createdAt).toLocaleString("vi-VN")
                : new Date().toLocaleString("vi-VN")}
            </Text>

            <Group gap="xs">
              <IconMapPin size={18} />
              <Text c="dimmed">Giao đến</Text>
            </Group>
            <Stack gap={0}>
              <Text fw={600}>{customer?.name}</Text>
              <Text size="sm" c="dimmed">
                {shipping?.address || "—"}
              </Text>
              {shipping?.eta && (
                <Text size="sm" c="green">
                  Dự kiến: {shipping.eta}
                </Text>
              )}
            </Stack>
          </SimpleGrid>

          <Divider my="sm" />

          <Group justify="space-between" align="center">
            <Text fz="lg" c="dimmed">
              Tổng thanh toán
            </Text>
            <Text fz="xl" fw={700} c="green">
              {VND(totalPrice)} VNĐ
            </Text>
          </Group>
        </Paper>

        <Group justify="space-between">
          <Button
            variant="default"
            leftSection={<IconShoppingBag size={18} />}
            radius="md"
            onClick={onContinue}
          >
            Tiếp tục mua sắm
          </Button>
          <Group>
            <Button
              variant="outline"
              leftSection={<IconFileDownload size={18} />}
              radius="md"
              onClick={onDownloadInvoice}
            >
              Tải hóa đơn
            </Button>
            <Button
              leftSection={<IconEye size={18} />}
              radius="md"
              onClick={onViewOrder}
            >
              Xem đơn hàng
            </Button>
          </Group>
        </Group>

        <Text size="sm" c="dimmed" ta="center">
          Biên nhận đã được gửi tới {customer?.email || "email của bạn"}. Cảm ơn
          bạn đã mua sắm tại MV SHOP!
        </Text>
      </Stack>
    </Modal>
  );
}
