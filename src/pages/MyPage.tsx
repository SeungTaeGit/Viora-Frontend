import { useState } from 'react';
import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import ProfileTab from '../components/ProfileTab';
import MyReviewsTab from '../components/MyReviewsTab';
import MyCommentsTab from '../components/MyCommentsTab';
import LikedReviewsTab from '../components/LikedReviewsTab';

function MyPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        마이페이지
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="mypage tabs">
          <Tab label="내 정보" />
          <Tab label="내가 쓴 리뷰" />
          <Tab label="내가 쓴 댓글" />
          <Tab label="좋아요 한 리뷰" />
        </Tabs>
      </Box>

      <Box sx={{ pt: 3 }}>
        {selectedTab === 0 && <ProfileTab />}
        {selectedTab === 1 && <MyReviewsTab />}
        {selectedTab === 2 && <MyCommentsTab />}
        {selectedTab === 3 && <LikedReviewsTab />}
      </Box>
    </Container>
  );
}

export default MyPage;