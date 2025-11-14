import { Card, CardActionArea, CardContent, Typography, Box, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";

interface ReviewCardProps {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
  imageUrl: string | null; //
}

function ReviewCard({ id, authorNickname, category, contentName, text, rating, imageUrl }: ReviewCardProps) {

  const truncatedText = text.length > 100 ? text.substring(0, 100) + "..." : text;

  return (
    <Card sx={{ mb: 2 }} component={Link} to={`/reviews/${id}`} style={{ textDecoration: 'none' }}>
      <CardActionArea>
        {imageUrl && (
          <CardMedia
            component="img"
            height="140"
            image={imageUrl}
            alt={contentName}
            onError={(e: any) => e.target.style.display = 'none'}
          />
        )}
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {category} - {contentName}
          </Typography>
          <Typography variant="h5" component="div">
            "{truncatedText}"
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