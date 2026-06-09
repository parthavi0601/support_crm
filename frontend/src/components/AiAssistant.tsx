import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
  Skeleton,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  ContentCopy as ContentCopyIcon,
  TaskAlt as CheckCircleOutlineIcon,
  LightbulbOutlined as LightbulbIcon,
  SummarizeOutlined as SummarizeIcon,
  CategoryOutlined as CategoryIcon,
  ReplyOutlined as ReplyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { analyzeTicket, AiAnalysisResult } from '../services/api';
import { Note } from '../types';

interface AiAssistantProps {
  subject: string;
  description: string;
  notes: Note[];
  onApplyPriority: (priority: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#22c55e',
  Medium: '#3b82f6',
  High: '#f59e0b',
  Critical: '#ef4444',
};

const CONFIDENCE_COLORS: Record<string, 'success' | 'warning' | 'error'> = {
  High: 'success',
  Medium: 'warning',
  Low: 'error',
};

function ResultCard({
  icon,
  title,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: isDark ? alpha('#ffffff', 0.02) : alpha('#f8f9ff', 0.8),
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.75,
          py: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark ? alpha('#5b6cf0', 0.06) : alpha('#5b6cf0', 0.04),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ color: 'primary.main', display: 'flex', fontSize: 15 }}>{icon}</Box>
          <Typography variant="caption" fontWeight={600} fontSize="0.7rem" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </Typography>
        </Box>
        {action}
      </Box>
      <Box sx={{ p: 1.75 }}>{children}</Box>
    </Box>
  );
}

export default function AiAssistant({ subject, description, notes, onApplyPriority }: AiAssistantProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [priorityApplied, setPriorityApplied] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setPriorityApplied(false);
    try {
      const { data } = await analyzeTicket({ subject, description, notes });
      setResult(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'AI analysis failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.response) return;
    await navigator.clipboard.writeText(result.response);
    setCopied(true);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyPriority = () => {
    if (!result?.priority?.priority) return;
    onApplyPriority(result.priority.priority);
    setPriorityApplied(true);
    toast.success(`Priority set to ${result.priority.priority}`);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${isDark ? alpha('#5b6cf0', 0.3) : alpha('#5b6cf0', 0.25)}`,
        background: isDark
          ? `linear-gradient(135deg, ${alpha('#5b6cf0', 0.06)} 0%, ${alpha('#8b5cf6', 0.04)} 100%)`
          : `linear-gradient(135deg, ${alpha('#5b6cf0', 0.04)} 0%, ${alpha('#8b5cf6', 0.02)} 100%)`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
          <Typography variant="subtitle2" fontWeight={600} fontSize="0.875rem">
            AI Assistant
          </Typography>
          <Chip
            label="Beta"
            size="small"
            sx={{
              height: 16,
              fontSize: '0.6rem',
              fontWeight: 600,
              bgcolor: isDark ? alpha('#8b5cf6', 0.15) : alpha('#8b5cf6', 0.1),
              color: '#8b5cf6',
              px: 0.25,
            }}
          />
        </Box>
        <IconButton size="small" sx={{ p: 0.25 }}>
          {expanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2.5 }}>
          {/* Trigger button */}
          <Button
            fullWidth
            variant="contained"
            size="small"
            startIcon={
              loading ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <AutoAwesomeIcon sx={{ fontSize: 16 }} />
              )
            }
            disabled={loading}
            onClick={handleAnalyze}
            sx={{
              py: 1,
              fontSize: '0.8125rem',
              borderRadius: 2,
              mb: result || loading ? 2 : 0,
              background: 'linear-gradient(135deg, #5b6cf0, #8b5cf6)',
              '&:hover': { background: 'linear-gradient(135deg, #4a59d9, #7c3aed)' },
              '&:disabled': { opacity: 0.6 },
            }}
          >
            {loading ? 'Analyzing…' : result ? 'Re-analyze' : ' Analyze with AI'}
          </Button>

          {/* Skeleton loading state */}
          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[120, 80, 160, 60].map((h, i) => (
                <Skeleton key={i} variant="rounded" height={h} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          )}

          {/* Results */}
          {result && !loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Summary */}
              <ResultCard icon={<SummarizeIcon fontSize="inherit" />} title="Summary">
                <Typography variant="body2" sx={{ fontSize: '0.8125rem', lineHeight: 1.65, color: 'text.primary' }}>
                  {result.summary}
                </Typography>
              </ResultCard>

              {/* Category */}
              <ResultCard icon={<CategoryIcon fontSize="inherit" />} title="Category">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={result.category.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  />
                  <Chip
                    label={`${result.category.confidence} confidence`}
                    size="small"
                    color={CONFIDENCE_COLORS[result.category.confidence] || 'default'}
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
              </ResultCard>

              {/* Suggested Priority */}
              <ResultCard
                icon={<LightbulbIcon fontSize="inherit" />}
                title="Suggested Priority"
                action={
                  <Button
                    size="small"
                    variant={priorityApplied ? 'outlined' : 'contained'}
                    color={priorityApplied ? 'success' : 'primary'}
                    onClick={handleApplyPriority}
                    disabled={priorityApplied}
                    sx={{
                      fontSize: '0.6875rem',
                      py: 0.25,
                      px: 1,
                      minWidth: 0,
                      borderRadius: 1.5,
                      height: 24,
                    }}
                  >
                    {priorityApplied ? '✓ Applied' : 'Apply'}
                  </Button>
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: PRIORITY_COLORS[result.priority.priority] || '#888',
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" fontWeight={700} fontSize="0.875rem">
                    {result.priority.priority}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.5 }}>
                  {result.priority.reason}
                </Typography>
              </ResultCard>

              {/* Suggested Response */}
              <ResultCard
                icon={<ReplyIcon fontSize="inherit" />}
                title="Suggested Response"
                action={
                  <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                    <IconButton size="small" onClick={handleCopy} sx={{ p: 0.25 }}>
                      {copied ? (
                        <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main' }} />
                      ) : (
                        <ContentCopyIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                      )}
                    </IconButton>
                  </Tooltip>
                }
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.8125rem',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                    color: 'text.primary',
                  }}
                >
                  {result.response}
                </Typography>
              </ResultCard>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
