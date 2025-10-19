// src/components/ReviewCard.tsx

import { Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom"; // 1. Link import

interface ReviewCardProps {
  id: number; // 2. ❗️ id를 props로 받도록 추가
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
}

function ReviewCard({ id, authorNickname, category, contentName, text, rating }: ReviewCardProps) {
  return (
    // 3. ❗️ Card 전체를 Link로 감싸줍니다.
    <Card sx={{ mb: 2 }} component={Link} to={`/reviews/${id}`} style={{ textDecoration: 'none' }}>
      <CardActionArea>
        <CardContent>
          {/* ... (나머지 내용은 동일) ... */}
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {category} - {contentName}
          </Typography>
          <Typography variant="h5" component="div">
            "{text}"
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              by {authorNickname}
            </Typography>
            <Typography variant="body2">
              ⭐ {rating} / 5
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ReviewCard;