import { Request, Response } from 'express';
import { productReviewService } from '../services';
import { getQueryParam, getPathParam } from '../utils/helpers';

class ProductReviewController {
  async createReview(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const review = await productReviewService.create(req.body, req.user.userId);
      res.status(201).json({
        message: 'Review created successfully',
        review
      });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  }

  async getReview(req: Request, res: Response) {
    try {
      const reviewId = parseInt(getPathParam(req.params.id), 10);
      const review = await productReviewService.findById(reviewId);

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json(review);
    } catch (error) {
      console.error('Get review error:', error);
      res.status(500).json({ error: 'Failed to fetch review' });
    }
  }

  async getProductReviews(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.productId), 10);
      const approvedOnly = req.query.approved !== 'false';
      const limit = getQueryParam(req.query.limit, 10);
      const offset = getQueryParam(req.query.offset, 0);

      const reviews = await productReviewService.findByProductId(productId, approvedOnly, limit, offset);
      res.json(reviews);
    } catch (error) {
      console.error('Get product reviews error:', error);
      res.status(500).json({ error: 'Failed to fetch product reviews' });
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const reviewId = parseInt(getPathParam(req.params.id), 10);
      const review = await productReviewService.update(reviewId, req.body);

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({
        message: 'Review updated successfully',
        review
      });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ error: 'Failed to update review' });
    }
  }

  async markReviewHelpful(req: Request, res: Response) {
    try {
      const reviewId = parseInt(getPathParam(req.params.id), 10);
      const review = await productReviewService.markHelpful(reviewId);

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({
        message: 'Review marked as helpful',
        review
      });
    } catch (error) {
      console.error('Mark review helpful error:', error);
      res.status(500).json({ error: 'Failed to mark review as helpful' });
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      const reviewId = parseInt(getPathParam(req.params.id), 10);
      const success = await productReviewService.delete(reviewId);

      if (!success) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  }

  async getAverageRating(req: Request, res: Response) {
    try {
      const productId = parseInt(getPathParam(req.params.productId), 10);
      const averageRating = await productReviewService.getAverageRating(productId);
      res.json({ averageRating });
    } catch (error) {
      console.error('Get average rating error:', error);
      res.status(500).json({ error: 'Failed to fetch average rating' });
    }
  }
}

export const productReviewController = new ProductReviewController();