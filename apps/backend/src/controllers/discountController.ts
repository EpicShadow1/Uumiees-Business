import { Request, Response } from 'express';
import { discountService } from '../services';
import { getPathParam } from '../utils/helpers';

class DiscountController {
  async createDiscount(req: Request, res: Response) {
    try {
      const discount = await discountService.create(req.body);
      res.status(201).json({
        message: 'Discount created successfully',
        discount
      });
    } catch (error) {
      console.error('Create discount error:', error);
      res.status(500).json({ error: 'Failed to create discount' });
    }
  }

  async getDiscountByCode(req: Request, res: Response) {
    try {
      const code = getPathParam(req.params.code);
      const discount = await discountService.findByCode(code);

      if (!discount) {
        return res.status(404).json({ error: 'Discount not found or invalid' });
      }

      res.json(discount);
    } catch (error) {
      console.error('Get discount by code error:', error);
      res.status(500).json({ error: 'Failed to fetch discount' });
    }
  }

  async validateDiscount(req: Request, res: Response) {
    try {
      const code = getPathParam(req.params.code);
      const { orderTotal } = req.body;

      const discount = await discountService.validateDiscount(code, orderTotal);

      if (!discount) {
        return res.status(400).json({ error: 'Discount is invalid or not applicable' });
      }

      const discountAmount = await discountService.calculateDiscount(discount, orderTotal);

      res.json({
        valid: true,
        discount,
        discountAmount,
        finalTotal: orderTotal - discountAmount
      });
    } catch (error) {
      console.error('Validate discount error:', error);
      res.status(500).json({ error: 'Failed to validate discount' });
    }
  }

  async getAllDiscounts(req: Request, res: Response) {
    try {
      const activeOnly = req.query.active === 'true';
      const discounts = await discountService.getAll(activeOnly);
      res.json(discounts);
    } catch (error) {
      console.error('Get all discounts error:', error);
      res.status(500).json({ error: 'Failed to fetch discounts' });
    }
  }

  async updateDiscount(req: Request, res: Response) {
    try {
      const discountId = parseInt(getPathParam(req.params.id), 10);
      const discount = await discountService.update(discountId, req.body);

      if (!discount) {
        return res.status(404).json({ error: 'Discount not found' });
      }

      res.json({
        message: 'Discount updated successfully',
        discount
      });
    } catch (error) {
      console.error('Update discount error:', error);
      res.status(500).json({ error: 'Failed to update discount' });
    }
  }

  async deleteDiscount(req: Request, res: Response) {
    try {
      const discountId = parseInt(getPathParam(req.params.id), 10);
      const success = await discountService.delete(discountId);

      if (!success) {
        return res.status(404).json({ error: 'Discount not found' });
      }

      res.json({ message: 'Discount deleted successfully' });
    } catch (error) {
      console.error('Delete discount error:', error);
      res.status(500).json({ error: 'Failed to delete discount' });
    }
  }
}

export const discountController = new DiscountController();