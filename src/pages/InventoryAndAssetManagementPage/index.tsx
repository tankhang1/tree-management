import { Card, Grid, Group, Stack, Text, Title } from "@mantine/core";

const InventoryAndAssetManagementPage = () => {
  return (
    <Stack>
      <Title order={3} mb="md">
        Quản lý kho & Tài sản
      </Title>
      <Grid gutter="lg">
        {[
          {
            label: "Tổng số tài sản",
            value: "128",
            color: "blue.6",
            description:
              "Bao gồm máy móc, thiết bị, nông cụ, nhà kính, cảm biến IoT, xe vận hành, v.v.",
            icon: "📦",
          },
          {
            label: "Tài sản đang sử dụng",
            value: "94",
            color: "teal.6",
            description:
              "Được phân công cho công việc canh tác hoặc gắn định danh tại vùng trồng cụ thể.",
            icon: "🔧",
          },
          {
            label: "Tài sản cần bảo trì",
            value: "12",
            color: "orange.6",
            description:
              "Đã đến lịch kiểm tra kỹ thuật hoặc phát hiện lỗi qua nhật ký hoạt động.",
            icon: "🛠️",
          },
          {
            label: "Tài sản chưa gán",
            value: "22",
            color: "red.6",
            description:
              "Chưa được phân phối cho nhân sự, hoặc chưa cập nhật trạng thái hoạt động.",
            icon: "📋",
          },
          {
            label: "Tài sản sắp hết hạn sử dụng",
            value: "6",
            color: "grape.6",
            description:
              "Các thiết bị hoặc vật tư đã cận hạn bảo hành hoặc có tuổi thọ giới hạn.",
            icon: "⏳",
          },
          {
            label: "Tài sản được thêm mới tháng này",
            value: "17",
            color: "green.6",
            description:
              "Các tài sản vừa được bổ sung gần đây, cần xác nhận tình trạng ban đầu.",
            icon: "➕",
          },
          {
            label: "Tài sản được sử dụng nhiều nhất",
            value: "Máy kéo Kubota M9540",
            color: "violet.6",
            description:
              "Thiết bị được ghi nhận hoạt động cao nhất trong tháng vừa qua.",
            icon: "🚜",
          },
          {
            label: "Thiết bị cảm biến đang hoạt động",
            value: "43",
            color: "cyan.6",
            description:
              "Cảm biến nhiệt độ, độ ẩm, ánh sáng hiện đang online và gửi dữ liệu.",
            icon: "📡",
          },
          {
            label: "Nhóm tài sản cố định lâu dài",
            value: "54",
            color: "gray.8",
            description:
              "Bao gồm nhà kho, nhà kính, hệ thống tưới tiêu cố định.",
            icon: "🏗️",
          },
          {
            label: "Giá trị tài sản ước tính",
            value: "3.2 tỷ ₫",
            color: "yellow.6",
            description:
              "Tổng giá trị các tài sản theo định mức kế toán hiện tại.",
            icon: "💰",
          },
          {
            label: "Tài sản được điều chuyển nội bộ",
            value: "8",
            color: "lime.6",
            description: "Thiết bị chuyển từ vùng này sang vùng khác trong kỳ.",
            icon: "🔁",
          },
          {
            label: "Tài sản đang chờ xác minh",
            value: "3",
            color: "red.5",
            description:
              "Có xung đột trong dữ liệu nhật ký sử dụng hoặc bị mất kết nối.",
            icon: "❓",
          },
        ].map((item, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              withBorder
              shadow="md"
              radius="md"
              p="lg"
              style={{
                transition: "transform 0.2s ease",
              }}
            >
              <Stack gap={6}>
                <Group justify="space-between">
                  <Group gap={6}>
                    <Text size="lg">{item.icon}</Text>
                    <Text fw={600} size="sm" c="gray.7">
                      {item.label}
                    </Text>
                  </Group>
                  <Title order={2} c={item.color} fw={700}>
                    {item.value}
                  </Title>
                </Group>
                <Text size="xs" c="gray.6">
                  {item.description}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};

export default InventoryAndAssetManagementPage;
